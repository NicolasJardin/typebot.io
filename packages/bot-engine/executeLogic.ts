import { LogicBlock, LogicBlockType, SessionState } from '@typebot.io/schemas'
import { executeAbTest } from './blocks/logic/abTest/executeAbTest'
import { executeConditionBlock } from './blocks/logic/condition/executeConditionBlock'
import { executeEnd } from './blocks/logic/end/executeEnd'
import { executeJumpBlock } from './blocks/logic/jump/executeJumpBlock'
import { executeRedirect } from './blocks/logic/redirect/executeRedirect'
import { executeRemoveTag } from './blocks/logic/removeTag/executeRemoveTag'
import { executeScript } from './blocks/logic/script/executeScript'
import { executeSetVariable } from './blocks/logic/setVariable/executeSetVariable'
import { executeCreateTag } from './blocks/logic/tag/executeCreateTag'
import { executeTransfer } from './blocks/logic/transfer/executeTransfer'
import { executeTypebotLink } from './blocks/logic/typebotLink/executeTypebotLink'
import { executeWait } from './blocks/logic/wait/executeWait'
import { ExecuteLogicResponse } from './types'

export const executeLogic =
  (state: SessionState) =>
  async (block: LogicBlock): Promise<ExecuteLogicResponse> => {
    switch (block.type) {
      case LogicBlockType.SET_VARIABLE:
        return executeSetVariable(state, block)
      case LogicBlockType.CONDITION:
        return executeConditionBlock(state, block)
      case LogicBlockType.REDIRECT:
        return executeRedirect(state, block)
      case LogicBlockType.SCRIPT:
        return executeScript(state, block)
      case LogicBlockType.TYPEBOT_LINK:
        return executeTypebotLink(state, block)
      case LogicBlockType.WAIT:
        return executeWait(state, block)
      case LogicBlockType.TRANSFER:
        return executeTransfer(state, block)
      case LogicBlockType.TAG:
        return executeCreateTag(block)
      case LogicBlockType.REMOVE_TAG:
        return executeRemoveTag(block)
      case LogicBlockType.END:
        return executeEnd(block)
      case LogicBlockType.JUMP:
        return executeJumpBlock(state, block.options)
      case LogicBlockType.AB_TEST:
        return executeAbTest(state, block)
    }

    return { outgoingEdgeId: block.outgoingEdgeId }
  }
