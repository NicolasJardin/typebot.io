import { ExecuteLogicResponse } from '@/features/chat/types'
import { ButtonBlock } from '@typebot.io/schemas'

export const executeButton = async (
  block: ButtonBlock
): Promise<ExecuteLogicResponse> => {
  if (!block.options.title || !block.options.url)
    return { outgoingEdgeId: block.outgoingEdgeId }

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        button: {
          title: block.options.title,
          url: block.options.url,
        },
      },
    ],
  }
}
