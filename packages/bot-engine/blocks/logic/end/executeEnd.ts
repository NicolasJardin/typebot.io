import { Block } from '@typebot.io/schemas'
import { ExecuteLogicResponse } from '../../../types'

export const executeEnd = async (
  block: Block
): Promise<ExecuteLogicResponse> => {
  return {
    outgoingEdgeId: block.outgoingEdgeId,
    clientSideActions: [
      {
        end: true,
      },
    ],
  }
}
