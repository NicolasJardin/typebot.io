import { router } from '@/helpers/server/trpc'
import { listTypebots } from './listTypebots'
import { createTypebot } from './createTypebot'
import { updateTypebot } from './updateTypebot'
import { getTypebot } from './getTypebot'
import { getPublishedTypebot } from './getPublishedTypebot'
import { publishTypebot } from './publishTypebot'
import { unpublishTypebot } from './unpublishTypebot'
import { deleteTypebot } from './deleteTypebot'
import { unlockTypebot } from './unlockTypebot'
import { verifyIfTypebotIsUnlocked } from './verifyIfTypebotIsUnlocked'

export const typebotRouter = router({
  createTypebot,
  updateTypebot,
  getTypebot,
  getPublishedTypebot,
  publishTypebot,
  unpublishTypebot,
  listTypebots,
  deleteTypebot,
  unlockTypebot,
  verifyIfTypebotIsUnlocked,
})
