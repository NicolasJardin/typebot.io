import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const spreadOptionsSchema = z.object({
  attendants: z.array(
    z.object({ id: z.string().optional(), name: z.string().optional() })
  ),
  message: z.string().optional(),
})

export const spreadBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.SPREAD]),
    options: spreadOptionsSchema,
  })
)

export const defaultSpreadOptions: SpreadOptions = {
  attendants: [],
}

export type SpreadBlock = z.infer<typeof spreadBlockSchema>
export type SpreadOptions = z.infer<typeof spreadOptionsSchema>
