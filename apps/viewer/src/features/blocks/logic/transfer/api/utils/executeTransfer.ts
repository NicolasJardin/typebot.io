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

  const departmentId = block.options?.attendantId || block.options?.departmentId

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: departmentId
      ? [
          {
            transfer: {
              departmentId,
              message: parsedMessage,
            },
            lastBubbleBlockId,
          },
        ]
      : undefined,
  }
}
