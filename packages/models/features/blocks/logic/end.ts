import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const endBlockSchema = blockBaseSchema.and(
  z.object({
    type: z.enum([LogicBlockType.END]),
  })
)
