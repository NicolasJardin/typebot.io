import { ExecuteLogicResponse } from '@/features/chat'
import { RemoveTagBlock } from 'models'

export const executeRemoveTag = async (
  block: RemoveTagBlock,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  if (!block.options.name) return { outgoingEdgeId: block.outgoingEdgeId }

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        removeTag: {
          name: block.options.name,
        },
        lastBubbleBlockId,
      },
    ],
  }
}
