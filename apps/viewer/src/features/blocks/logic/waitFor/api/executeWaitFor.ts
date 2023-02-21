import { ExecuteLogicResponse } from '@/features/chat'
import { parseVariables } from '@/features/variables'
import { SessionState, WaitForBlock } from 'models'

export const executeWaitFor = async (
  { typebot: { variables } }: SessionState,
  block: WaitForBlock,
  lastBubbleBlockId?: string
): Promise<ExecuteLogicResponse> => {
  if (!block.options?.number && !block.options?.until)
    return { outgoingEdgeId: block.outgoingEdgeId }

  const parsedNumber = parseVariables(variables)(block.options.number)

  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        waitFor: {
          number: Number(parsedNumber),
          type: block.options.type,
          until: block.options.until
            ? new Date(block.options.until)
            : undefined,
        },
        lastBubbleBlockId,
      },
    ],
  }
}
