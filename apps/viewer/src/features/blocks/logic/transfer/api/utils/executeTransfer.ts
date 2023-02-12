import { ExecuteLogicResponse } from '@/features/chat'
import { parseVariables } from '@/features/variables'
import { SessionState, TransferBlock } from 'models'

export const executeTransfer = async (
  { typebot: { variables } }: SessionState,
  block: TransferBlock,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  if (!block.options?.departmentId && !block.options?.attendantId)
    return { outgoingEdgeId: block.outgoingEdgeId }

  const parsedMessage = parseVariables(variables)(block.options?.message)

  const getTransfer = () => {
    if (block.options?.attendantId)
      return {
        attendantId: block.options?.attendantId,
        message: parsedMessage,
      }

    return {
      departmentId: block.options?.departmentId,
      message: parsedMessage,
    }
  }

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions:
      block.options?.attendantId || block.options?.departmentId
        ? [
            {
              transfer: getTransfer(),
              lastBubbleBlockId,
            },
          ]
        : undefined,
  }
}
