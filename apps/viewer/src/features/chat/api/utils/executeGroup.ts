import { injectVariableValuesInButtonsInputBlock } from '@/features/blocks/inputs/buttons/api/utils/injectVariableValuesInButtonsInputBlock'
import { computePaymentInputRuntimeOptions } from '@/features/blocks/inputs/payment/api'
import { deepParseVariable } from '@/features/variables'
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
} from 'models'
import {
  isBubbleBlock,
  isDefined,
  isInputBlock,
  isIntegrationBlock,
  isLogicBlock,
} from 'utils'
import { executeBubble } from './executeBubble'
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

    for (const block of group.blocks) {
      nextEdgeId = block.outgoingEdgeId

      if (isBubbleBlock(block) && block.type !== BubbleBlockType.BUTTON) {
        messages.push(
          parseBubbleBlock(newSessionState.typebot.variables)(block)
        )
        lastBubbleBlockId = block.id

        continue
      }

      if (block.type === LogicBlockType.TRANSFER) {
        messages.push({
          content: block.options,
          id: block.id,
          type: block.type,
        })
        lastBubbleBlockId = block.id

        continue
      }

      if (isInputBlock(block))
        return {
          messages,
          input: await injectVariablesValueInBlock(newSessionState)(block),
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
      const executionResponse =
        block.type === BubbleBlockType.BUTTON
          ? await executeBubble(newSessionState, lastBubbleBlockId)(block)
          : isLogicBlock(block)
          ? await executeLogic(newSessionState, lastBubbleBlockId)(block)
          : isIntegrationBlock(block)
          ? await executeIntegration(newSessionState, lastBubbleBlockId)(block)
          : null

      if (!executionResponse) continue
      if (
        'clientSideActions' in executionResponse &&
        executionResponse.clientSideActions
      )
        clientSideActions = [
          ...(clientSideActions ?? []),
          ...executionResponse.clientSideActions,
        ]
      if (executionResponse.logs)
        logs = [...(logs ?? []), ...executionResponse.logs]
      if (executionResponse.newSessionState)
        newSessionState = executionResponse.newSessionState
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
  (state: Pick<SessionState, 'isPreview' | 'typebot'>) =>
  (block: InputBlock): Promise<RuntimeOptions> | undefined => {
    switch (block.type) {
      case InputBlockType.PAYMENT: {
        return computePaymentInputRuntimeOptions(state)(block.options)
      }
    }
  }

const getPrefilledInputValue =
  (variables: SessionState['typebot']['variables']) => (block: InputBlock) => {
    return (
      variables
        .find(
          (variable) =>
            variable.id === block.options.variableId &&
            isDefined(variable.value)
        )
        ?.value?.toString() ?? undefined
    )
  }

const parseBubbleBlock =
  (variables: SessionState['typebot']['variables']) =>
  (block: Exclude<BubbleBlock, ButtonBlock>): ChatReply['messages'][0] => {
    switch (block.type) {
      case BubbleBlockType.EMBED: {
        const message = deepParseVariable(variables)(block)
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
        return deepParseVariable(variables)(block)
    }
  }

const injectVariablesValueInBlock =
  (state: Pick<SessionState, 'isPreview' | 'typebot'>) =>
  async (block: InputBlock): Promise<ChatReply['input']> => {
    switch (block.type) {
      case InputBlockType.CHOICE: {
        return injectVariableValuesInButtonsInputBlock(state.typebot.variables)(
          block
        )
      }
      default: {
        return deepParseVariable(state.typebot.variables)({
          ...block,
          runtimeOptions: await computeRuntimeOptions(state)(block),
          prefilledValue: getPrefilledInputValue(state.typebot.variables)(
            block
          ),
        })
      }
    }
  }
