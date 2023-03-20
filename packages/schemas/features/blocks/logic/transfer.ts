import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const transferOptionsSchema = z.object({
  department: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  attendant: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  message: z.string().optional(),
})

export const transferBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.TRANSFER]),
    options: transferOptionsSchema,
  })
)

export const defaultTransferOptions: TransferOptions = {
  attendant: {},
  department: {},
}

export type TransferBlock = z.infer<typeof transferBlockSchema>
export type TransferOptions = z.infer<typeof transferOptionsSchema>
