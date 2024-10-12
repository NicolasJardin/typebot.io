import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

const deviceSchema = z
  .object({
    name: z.string(),
    chatId: z.string(),
    id: z.string(),
  })
  .nullable()

export const sendFromOptionsSchema = z.object({
  device: deviceSchema,
  contact: z.string(),
  content: z.string(),
})

export const sendFromBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.SEND_FROM]),
    options: sendFromOptionsSchema,
  })
)

export const defaultSendFromOptions: SendFromOptions = {
  device: null,
  contact: '',
  content: '',
}

export type SendFromBlock = z.infer<typeof sendFromBlockSchema>
export type SendFromOptions = z.infer<typeof sendFromOptionsSchema>
