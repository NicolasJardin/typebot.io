import { ConditionBlock, SessionState } from '@typebot.io/schemas'
import { ExecuteLogicResponse } from '@/features/chat/types'
import { executeCondition } from './executeCondition'

export const executeConditionBlock = async (
  { typebot: { variables, id } }: SessionState,
  block: ConditionBlock
): Promise<ExecuteLogicResponse> => {
  const getPassedCondition = async () => {
    for (const item of block.items) {
      const result = await executeCondition(variables)(item.content, id)
      if (result) return item
    }
  }

  const passedCondition = await getPassedCondition()

  return {
    outgoingEdgeId: passedCondition
      ? passedCondition.outgoingEdgeId
      : block.outgoingEdgeId,
  }
}
