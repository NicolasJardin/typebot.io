import { TagBlock } from '@typebot.io/schemas'
import { ExecuteLogicResponse } from '../../../types'

export const executeCreateTag = async (
  block: TagBlock
): Promise<ExecuteLogicResponse> => {
  if (!block.options.name) return { outgoingEdgeId: block.outgoingEdgeId }

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        createTag: {
          name: block.options.name,
        },
      },
    ],
  }
}
