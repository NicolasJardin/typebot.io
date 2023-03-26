import { ExecuteLogicResponse } from '@/features/chat/types'
import { parseVariables } from '@/features/variables/parseVariables'
import { SessionState, TransferBlock } from '@typebot.io/schemas'

export const executeTransfer = async (
  { typebot: { variables } }: SessionState,
  block: TransferBlock,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  //TODO Não está mais caindo aqui por causa das messages no executeGroup

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
