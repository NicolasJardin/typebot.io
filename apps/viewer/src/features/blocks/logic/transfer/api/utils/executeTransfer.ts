import { ExecuteLogicResponse } from '@/features/chat'
import { parseVariables } from '@/features/variables'
import { SessionState, TransferBlock } from 'models'

export const executeTransfer = async (
  { typebot: { variables } }: SessionState,
  block: TransferBlock,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  if (!block.options?.department.id && !block.options?.attendant.id)
    return { outgoingEdgeId: block.outgoingEdgeId }

  const parsedMessage = parseVariables(variables)(block.options?.message)

  const getTransfer = () => {
    if (block.options?.attendant.id)
      return {
        attendantId: block.options?.attendant.id,
        message: parsedMessage,
      }

    return {
      departmentId: block.options?.department.id,
      message: parsedMessage,
    }
  }

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions:
      block.options?.attendant.id || block.options?.department.id
        ? [
            {
              transfer: getTransfer(),
              lastBubbleBlockId,
            },
          ]
        : undefined,
  }
}
