import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const updateNameOptionsSchema = z.object({
  variable: z
    .object({
      name: z.string(),
      id: z.string(),
      value: z.string().nullable(),
    })
    .nullable(),
})

export const updateNameBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.UPDATE_SYSTEM_NAME]),
    options: updateNameOptionsSchema,
  })
)

export const defaultUpdateNameOptions: UpdateNameOptions = {
  variable: null,
}

export type UpdateNameBlock = z.infer<typeof updateNameBlockSchema>
export type UpdateNameOptions = z.infer<typeof updateNameOptionsSchema>
