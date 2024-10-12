import { injectVariableValuesInButtonsInputBlock } from '@/features/blocks/inputs/buttons/injectVariableValuesInButtonsInputBlock'
import { computePaymentInputRuntimeOptions } from '@/features/blocks/inputs/payment/computePaymentInputRuntimeOptions'
import { injectVariableValuesInPictureChoiceBlock } from '@/features/blocks/inputs/pictureChoice/injectVariableValuesInPictureChoiceBlock'
import { deepParseVariables } from '@/features/variables/deepParseVariable'
import { parseVariables } from '@/features/variables/parseVariables'
import { getUntil } from '@/modules/time'
import {
  isBubbleBlock,
  isDefined,
  isInputBlock,
  isIntegrationBlock,
  isLogicBlock,
  isNotEmpty,
} from '@typebot.io/lib'
import {
  BubbleBlock,
  BubbleBlockType,
  ButtonBlock,
  ChatReply,
  Group,
  InputBlock,
  InputBlockType,
  LogicBlockType,
  RuntimeOptions,
  SessionState,
} from '@typebot.io/schemas'
import { format, isValid } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { executeIntegration } from './executeIntegration'
import { executeLogic } from './executeLogic'
import { getNextGroup } from './getNextGroup'

export const executeGroup =
  (
    state: SessionState,
    currentReply?: ChatReply,
    currentLastBubbleId?: string
  ) =>
  async (
    group: Group
  ): Promise<ChatReply & { newSessionState: SessionState }> => {
    const messages: ChatReply['messages'] = currentReply?.messages ?? []
    let clientSideActions: ChatReply['clientSideActions'] =
      currentReply?.clientSideActions
    let logs: ChatReply['logs'] = currentReply?.logs
    let nextEdgeId = null
    let lastBubbleBlockId: string | undefined = currentLastBubbleId

    let newSessionState = state

    function replaceVariablesInString(str: string) {
      return str.replace(/\{\{(.*?)\}\}/g, (_, variableName: string) => {
        const foundVariable = state.typebot.variables.find(
          ({ name }) => name === variableName
        )?.value as string | undefined
        return foundVariable !== undefined
          ? foundVariable
          : `{{${variableName}}}`
      })
    }

    for (const block of group.blocks) {
      nextEdgeId = block.outgoingEdgeId

      //@ts-ignore
      if (isBubbleBlock(block) && block.type !== BubbleBlockType.BUTTON) {
        messages.push(
          parseBubbleBlock(newSessionState.typebot.variables)(block)
        )
        lastBubbleBlockId = block.id

        continue
      }

      switch (block.type) {
        case LogicBlockType.TRANSFER: {
          const parsedMessage = parseVariables(
            newSessionState.typebot.variables
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
            newSessionState.typebot.variables
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

        case LogicBlockType.TEMPLATE: {
          messages.push({
            content: {
              device: {
                id: block.options.device?.id,
                name: block.options.device?.name,
              },
              template: {
                id: block.options.template?.id,
                name: block.options.template?.name,
              },
              variables:
                block.options.variables?.map((variable) => ({
                  ...variable,
                  value: variable.value?.includes('{{')
                    ? (state.typebot.variables.find(
                        ({ name }) =>
                          name === variable.value?.replace(/{{|}}/g, '')
                      )?.value as string)
                    : variable.value,
                })) || [],
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

        case LogicBlockType.UPDATE_SYSTEM_NAME:
          messages.push({
            content: {
              value:
                (state.typebot.variables.find(
                  ({ name }) => name === block.options.variable?.name
                )?.value as string) || null,
            },
            id: block.id,
            type: block.type,
          })

          lastBubbleBlockId = block.id

          continue

        case LogicBlockType.COMBINE_MESSAGES:
          messages.push({
            content: block.options,
            id: block.id,
            type: block.type,
          })

          lastBubbleBlockId = block.id

          continue

        case LogicBlockType.SEND_FROM:
          messages.push({
            content: {
              device: block.options.device,
              contact: replaceVariablesInString(block.options.contact),
              message: replaceVariablesInString(block.options.content),
            },
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
            (action) =>
              'setVariable' in action ||
              'streamOpenAiChatCompletion' in action ||
              'webhookToExecute' in action
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

    if (!nextEdgeId)
      return { messages, newSessionState, clientSideActions, logs }

    const nextGroup = getNextGroup(newSessionState)(nextEdgeId)

    if (nextGroup?.updatedContext) newSessionState = nextGroup.updatedContext

    if (!nextGroup) {
      return { messages, newSessionState, clientSideActions, logs }
    }

    return executeGroup(
      newSessionState,
      {
        messages,
        clientSideActions,
        logs,
      },
      lastBubbleBlockId
    )(nextGroup.group)
  }

const computeRuntimeOptions =
  (state: Pick<SessionState, 'result' | 'typebot'>) =>
  (block: InputBlock): Promise<RuntimeOptions> | undefined => {
    switch (block.type) {
      case InputBlockType.PAYMENT: {
        return computePaymentInputRuntimeOptions(state)(block.options)
      }
    }
  }

const getPrefilledInputValue =
  (variables: SessionState['typebot']['variables']) => (block: InputBlock) => {
    const variableValue = variables.find(
      (variable) =>
        variable.id === block.options.variableId && isDefined(variable.value)
    )?.value
    if (!variableValue || Array.isArray(variableValue)) return

    return variableValue
  }

const parseBubbleBlock =
  (variables: SessionState['typebot']['variables']) =>
  (block: Exclude<BubbleBlock, ButtonBlock>): ChatReply['messages'][0] => {
    switch (block.type) {
      case BubbleBlockType.TEXT:
        return deepParseVariables(
          variables,
          {},
          { takeLatestIfList: true }
        )(block)
      case BubbleBlockType.EMBED: {
        const message = deepParseVariables(variables)(block)
        return {
          ...message,
          content: {
            ...message.content,
            height:
              typeof message.content.height === 'string'
                ? parseFloat(message.content.height)
                : message.content.height,
          },
        }
      }
      default:
        return deepParseVariables(variables)(block)
    }
  }

const parseInput =
  (state: SessionState) =>
  async (block: InputBlock): Promise<ChatReply['input']> => {
    switch (block.type) {
      case InputBlockType.WAIT_FOR: {
        return deepParseVariables(state.typebot.variables)({
          ...block,
          options: {
            ...block.options,
            until: block.options.until
              ? format(
                  fromZonedTime(
                    getUntil(block.options),
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  ),
                  'yyyy-MM-dd HH:mm:ss'
                )
              : '',
          },
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(state.typebot.variables)(
            block
          ),
        })
      }

      case InputBlockType.TEXT:
        return deepParseVariables(state.typebot.variables)({
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
                          fromZonedTime(
                            getUntil(block.options.wait),
                            Intl.DateTimeFormat().resolvedOptions().timeZone
                          ),
                          'yyyy-MM-dd HH:mm:ss'
                        )
                      : undefined,
                  }
                : null,
          },
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(state.typebot.variables)(
            block
          ),
        })

      case InputBlockType.CHOICE: {
        return injectVariableValuesInButtonsInputBlock(state)(block)
      }
      case InputBlockType.PICTURE_CHOICE: {
        return injectVariableValuesInPictureChoiceBlock(
          state.typebot.variables
        )(block)
      }
      case InputBlockType.NUMBER: {
        const parsedBlock = deepParseVariables(state.typebot.variables)({
          ...block,
          prefilledValue: getPrefilledInputValue(state.typebot.variables)(
            block
          ),
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
      default: {
        return deepParseVariables(state.typebot.variables)({
          ...block,
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(state.typebot.variables)(
            block
          ),
        })
      }
    }
  }
