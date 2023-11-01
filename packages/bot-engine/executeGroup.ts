import {
  BubbleBlockType,
  ChatReply,
  Group,
  InputBlock,
  InputBlockType,
  LogicBlockType,
  RuntimeOptions,
  SessionState,
} from '@typebot.io/schemas'
import { getUntil } from './modules/time'
import {
  isBubbleBlock,
  isInputBlock,
  isIntegrationBlock,
  isLogicBlock,
  isNotEmpty,
} from '@typebot.io/lib'
import { getNextGroup } from './getNextGroup'
import { executeLogic } from './executeLogic'
import { executeIntegration } from './executeIntegration'
import { computePaymentInputRuntimeOptions } from './blocks/inputs/payment/computePaymentInputRuntimeOptions'
import { injectVariableValuesInButtonsInputBlock } from './blocks/inputs/buttons/injectVariableValuesInButtonsInputBlock'
import { injectVariableValuesInPictureChoiceBlock } from './blocks/inputs/pictureChoice/injectVariableValuesInPictureChoiceBlock'
import { getPrefilledInputValue } from './getPrefilledValue'
import { parseDateInput } from './blocks/inputs/date/parseDateInput'
import { deepParseVariables } from './variables/deepParseVariables'
import { parseBubbleBlock } from './parseBubbleBlock'
import { format, isValid } from 'date-fns'
import { parseVariables } from './variables/parseVariables'

type ContextProps = {
  version: 1 | 2
  state: SessionState
  currentReply?: ChatReply
  currentLastBubbleId?: string
  firstBubbleWasStreamed?: boolean
}

export const executeGroup = async (
  group: Group,
  {
    version,
    state,
    currentReply,
    currentLastBubbleId,
    firstBubbleWasStreamed,
  }: ContextProps
): Promise<ChatReply & { newSessionState: SessionState }> => {
  const messages: ChatReply['messages'] = currentReply?.messages ?? []
  let clientSideActions: ChatReply['clientSideActions'] =
    currentReply?.clientSideActions
  let logs: ChatReply['logs'] = currentReply?.logs
  let nextEdgeId = null
  let lastBubbleBlockId: string | undefined = currentLastBubbleId

  let newSessionState = state

  let index = -1
  for (const block of group.blocks) {
    index++
    nextEdgeId = block.outgoingEdgeId

    if (isBubbleBlock(block) && block.type !== BubbleBlockType.BUTTON) {
      if (firstBubbleWasStreamed && index === 0) continue
      messages.push(
        parseBubbleBlock(block, {
          version,
          variables: newSessionState.typebotsQueue[0].typebot.variables,
        })
      )
      lastBubbleBlockId = block.id
      continue
    }

    switch (block.type) {
      case LogicBlockType.TRANSFER: {
        const parsedMessage = parseVariables(
          newSessionState.typebotsQueue[0].typebot.variables
        )(block.options?.message)

        const getTransfer = () => {
          if (block?.options?.attendant?.id)
            return {
              attendant: block?.options?.attendant,
              message: parsedMessage,
            }

          if (block?.options?.group?.type)
            return {
              group: block?.options.group,
              message: parsedMessage,
            }

          return {
            department: block?.options?.department,
            message: parsedMessage,
          }
        }

        messages.push({
          content: getTransfer(),
          id: block.id,
          type: block.type,
        })

        lastBubbleBlockId = block.id

        continue
      }

      case LogicBlockType.SPREAD: {
        const parsedMessage = parseVariables(
          newSessionState.typebotsQueue[0].typebot.variables
        )(block.options?.message)

        messages.push({
          content: {
            attendants: block.options.attendants,
            message: parsedMessage,
          },
          id: block.id,
          type: block.type,
        })

        lastBubbleBlockId = block.id

        continue
      }

      case LogicBlockType.WAIT:
        messages.push({
          content: block.options,
          id: block.id,
          type: block.type,
        })

        lastBubbleBlockId = block.id

        continue

      case LogicBlockType.TAG:
        messages.push({
          content: block.options,
          id: block.id,
          type: block.type,
        })

        lastBubbleBlockId = block.id

        continue

      case LogicBlockType.REMOVE_TAG:
        messages.push({
          content: block.options,
          id: block.id,
          type: block.type,
        })

        lastBubbleBlockId = block.id

        continue

      case LogicBlockType.END:
        messages.push({
          content: {},
          id: block.id,
          type: block.type,
        })

        lastBubbleBlockId = block.id

        continue

      //@ts-ignore
      case BubbleBlockType.BUTTON:
        messages.push({
          content: (block as any).options,
          id: (block as any).id,
          type: (block as any).type,
        })

        lastBubbleBlockId = (block as any).id

        continue
    }

    if (isInputBlock(block))
      return {
        messages,
        input: await parseInput(newSessionState)(block),
        newSessionState: {
          ...newSessionState,
          currentBlock: {
            groupId: group.id,
            blockId: block.id,
          },
        },
        clientSideActions,
        logs,
      }
    const executionResponse = isLogicBlock(block)
      ? await executeLogic(newSessionState)(block)
      : isIntegrationBlock(block)
      ? await executeIntegration(newSessionState)(block)
      : null

    if (!executionResponse) continue
    if (executionResponse.logs)
      logs = [...(logs ?? []), ...executionResponse.logs]
    if (executionResponse.newSessionState)
      newSessionState = executionResponse.newSessionState
    if (
      'clientSideActions' in executionResponse &&
      executionResponse.clientSideActions
    ) {
      clientSideActions = [
        ...(clientSideActions ?? []),
        ...executionResponse.clientSideActions.map((action) => ({
          ...action,
          lastBubbleBlockId,
        })),
      ]
      if (
        executionResponse.clientSideActions?.find(
          (action) => action.expectsDedicatedReply
        )
      ) {
        return {
          messages,
          newSessionState: {
            ...newSessionState,
            currentBlock: {
              groupId: group.id,
              blockId: block.id,
            },
          },
          clientSideActions,
          logs,
        }
      }
    }

    if (executionResponse.outgoingEdgeId) {
      nextEdgeId = executionResponse.outgoingEdgeId
      break
    }
  }

  if (!nextEdgeId && newSessionState.typebotsQueue.length === 1)
    return { messages, newSessionState, clientSideActions, logs }

  const nextGroup = await getNextGroup(newSessionState)(nextEdgeId ?? undefined)

  newSessionState = nextGroup.newSessionState

  if (!nextGroup.group) {
    return { messages, newSessionState, clientSideActions, logs }
  }

  return executeGroup(nextGroup.group, {
    version,
    state: newSessionState,
    currentReply: {
      messages,
      clientSideActions,
      logs,
    },
    currentLastBubbleId: lastBubbleBlockId,
  })
}

const computeRuntimeOptions =
  (state: SessionState) =>
  (block: InputBlock): Promise<RuntimeOptions> | undefined => {
    switch (block.type) {
      case InputBlockType.PAYMENT: {
        return computePaymentInputRuntimeOptions(state)(block.options)
      }
    }
  }

export const parseInput =
  (state: SessionState) =>
  async (block: InputBlock): Promise<ChatReply['input']> => {
    switch (block.type) {
      case InputBlockType.WAIT_FOR: {
        return deepParseVariables(state.typebotsQueue[0].typebot.variables)({
          ...block,
          options: {
            ...block.options,
            until: block.options.until
              ? format(new Date(getUntil(block.options)), 'yyyy-MM-dd HH:mm:ss')
              : '',
          },
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(
            state.typebotsQueue[0].typebot.variables
          )(block),
        })
      }
      case InputBlockType.CHOICE: {
        return injectVariableValuesInButtonsInputBlock(state)(block)
      }
      case InputBlockType.PICTURE_CHOICE: {
        return injectVariableValuesInPictureChoiceBlock(
          state.typebotsQueue[0].typebot.variables
        )(block)
      }
      case InputBlockType.NUMBER: {
        const parsedBlock = deepParseVariables(
          state.typebotsQueue[0].typebot.variables
        )({
          ...block,
          prefilledValue: getPrefilledInputValue(
            state.typebotsQueue[0].typebot.variables
          )(block),
        })
        return {
          ...parsedBlock,
          options: {
            ...parsedBlock.options,
            min: isNotEmpty(parsedBlock.options.min as string)
              ? Number(parsedBlock.options.min)
              : undefined,
            max: isNotEmpty(parsedBlock.options.max as string)
              ? Number(parsedBlock.options.max)
              : undefined,
            step: isNotEmpty(parsedBlock.options.step as string)
              ? Number(parsedBlock.options.step)
              : undefined,
          },
        }
      }
      case InputBlockType.DATE: {
        return parseDateInput(state)(block)
      }
      case InputBlockType.TEXT: {
        return deepParseVariables(state.typebotsQueue[0].typebot.variables)({
          ...block,
          options: {
            ...block.options,
            wait:
              block.options.wait?.until &&
              isValid(new Date(block.options.wait.until))
                ? {
                    ...block.options.wait,
                    until: block.options.wait.until
                      ? format(
                          new Date(getUntil(block.options.wait)),
                          'yyyy-MM-dd HH:mm:ss'
                        )
                      : undefined,
                  }
                : null,
          },
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(
            state.typebotsQueue[0].typebot.variables
          )(block),
        })
      }
      default: {
        return deepParseVariables(state.typebotsQueue[0].typebot.variables)({
          ...block,
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(
            state.typebotsQueue[0].typebot.variables
          )(block),
        })
      }
    }
  }
