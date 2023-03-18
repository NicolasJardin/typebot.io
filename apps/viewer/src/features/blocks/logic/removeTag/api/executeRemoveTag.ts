import { ExecuteLogicResponse } from '@/features/chat/types'
import { RemoveTagBlock } from '@typebot.io/schemas'

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
