import { executeButton } from '@/features/blocks/bubbles/button/api/executeButton'
import { ButtonBlock, SessionState } from 'models'
import { ExecuteBubbleResponse } from '../../types'

export const executeBubble =
  (state: SessionState, lastBubbleBlockId?: string) =>
  async (block: ButtonBlock): Promise<ExecuteBubbleResponse> => {
    return executeButton(block)
  }
