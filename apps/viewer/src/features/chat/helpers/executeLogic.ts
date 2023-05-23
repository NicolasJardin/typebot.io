import { executeAbTest } from '@/features/blocks/logic/abTest/executeAbTest'
import { executeCondition } from '@/features/blocks/logic/condition/executeCondition'
import { executeCreateTag } from '@/features/blocks/logic/createTag/api/executeCreateTag'
import { executeEnd } from '@/features/blocks/logic/end/api/executeEnd'
import { executeJumpBlock } from '@/features/blocks/logic/jump/executeJumpBlock'
import { executeRedirect } from '@/features/blocks/logic/redirect/executeRedirect'
import { executeRemoveTag } from '@/features/blocks/logic/removeTag/api/executeRemoveTag'
import { executeScript } from '@/features/blocks/logic/script/executeScript'
import { executeSetVariable } from '@/features/blocks/logic/setVariable/executeSetVariable'
import { executeTransfer } from '@/features/blocks/logic/transfer/api/utils/executeTransfer'
import { executeTypebotLink } from '@/features/blocks/logic/typebotLink/executeTypebotLink'
import { executeWait } from '@/features/blocks/logic/wait/executeWait'
import { LogicBlock, LogicBlockType, SessionState } from '@typebot.io/schemas'
import { ExecuteLogicResponse } from '../types'

export const executeLogic =
  (state: SessionState, lastBubbleBlockId?: string) =>
  async (block: LogicBlock): Promise<ExecuteLogicResponse> => {
    switch (block.type) {
      case LogicBlockType.SET_VARIABLE:
        return executeSetVariable(state, block, lastBubbleBlockId)
      case LogicBlockType.CONDITION:
        return executeCondition(state, block)
      case LogicBlockType.REDIRECT:
        return executeRedirect(state, block, lastBubbleBlockId)
      case LogicBlockType.SCRIPT:
        return executeScript(state, block, lastBubbleBlockId)
      case LogicBlockType.TYPEBOT_LINK:
        return executeTypebotLink(state, block)
      case LogicBlockType.WAIT:
        return executeWait(state, block, lastBubbleBlockId)
      case LogicBlockType.TRANSFER:
        return executeTransfer(state, block, lastBubbleBlockId)
      case LogicBlockType.TAG:
        return executeCreateTag(block, lastBubbleBlockId)
      case LogicBlockType.REMOVE_TAG:
        return executeRemoveTag(block, lastBubbleBlockId)
      case LogicBlockType.END:
        return executeEnd(block, lastBubbleBlockId)
      case LogicBlockType.JUMP:
        return executeJumpBlock(state, block.options)
      case LogicBlockType.AB_TEST:
        return executeAbTest(state, block)
    }

    return { outgoingEdgeId: block.outgoingEdgeId }
  }
