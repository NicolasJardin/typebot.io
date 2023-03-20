import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const removeTagOptionsSchema = z.object({
  color: z.string().optional(),
  name: z.string().optional(),
})

export const removeTagBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.REMOVE_TAG]),
    options: removeTagOptionsSchema,
  })
)

export const defaultRemoveTagOptions: RemoveTagOptions = {}

export type RemoveTagBlock = z.infer<typeof removeTagBlockSchema>
export type RemoveTagOptions = z.infer<typeof removeTagOptionsSchema>
