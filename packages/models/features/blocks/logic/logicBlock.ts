import { z } from 'zod'
import { conditionBlockSchema } from './condition'
import { endBlockSchema } from './end'
import { jumpBlockSchema, jumpOptionsSchema } from './jump'
import { redirectBlockSchema, redirectOptionsSchema } from './redirect'
import { removeTagBlockSchema, removeTagOptionsSchema } from './removeTag'
import { scriptBlockSchema, scriptOptionsSchema } from './script'
import { setVariableBlockSchema, setVariableOptionsSchema } from './setVariable'
import { tagBlockSchema, tagOptionsSchema } from './tag'
import { transferBlockSchema, transferOptionsSchema } from './transfer'
import { typebotLinkBlockSchema, typebotLinkOptionsSchema } from './typebotLink'
import { waitBlockSchema, waitOptionsSchema } from './wait'

const logicBlockOptionsSchema = scriptOptionsSchema
  .or(redirectOptionsSchema)
  .or(setVariableOptionsSchema)
  .or(typebotLinkOptionsSchema)
  .or(waitOptionsSchema)
  .or(transferOptionsSchema)
  .or(tagOptionsSchema)
  .or(removeTagOptionsSchema)
  .or(jumpOptionsSchema)

export const logicBlockSchema = scriptBlockSchema
  .or(conditionBlockSchema)
  .or(redirectBlockSchema)
  .or(typebotLinkBlockSchema)
  .or(setVariableBlockSchema)
  .or(waitBlockSchema)
  .or(transferBlockSchema)
  .or(tagBlockSchema)
  .or(endBlockSchema)
  .or(removeTagBlockSchema)
  .or(jumpBlockSchema)

export type LogicBlock = z.infer<typeof logicBlockSchema>
export type LogicBlockOptions = z.infer<typeof logicBlockOptionsSchema>
