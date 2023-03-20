import { ExecuteLogicResponse } from '@/features/chat/types'
import { Block } from '@typebot.io/schemas'

export const executeEnd = async (
  block: Block,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        end: true,
        lastBubbleBlockId,
      },
    ],
  }
}
