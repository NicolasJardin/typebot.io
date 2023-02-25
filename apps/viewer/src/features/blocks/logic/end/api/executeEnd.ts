import { ExecuteLogicResponse } from '@/features/chat'
import { Block } from 'models'

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
