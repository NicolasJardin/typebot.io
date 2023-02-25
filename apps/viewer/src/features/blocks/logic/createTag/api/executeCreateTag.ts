import { ExecuteLogicResponse } from '@/features/chat'
import { TagBlock } from 'models'

export const executeCreateTag = async (
  block: TagBlock,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  if (!block.options.name) return { outgoingEdgeId: block.outgoingEdgeId }

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        createTag: {
          name: block.options.name,
        },
        lastBubbleBlockId,
      },
    ],
  }
}
