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

const templateSchema = z
  .object({
    name: z.string(),
    language: z.string(),
    status: z.string(),
    category: z.string(),
    id: z.string(),
  })
  .nullable()

export const templateOptionsSchema = z.object({
  device: deviceSchema,
  template: templateSchema,
})

export const templateBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.TEMPLATE]),
    options: templateOptionsSchema,
  })
)

export const defaultTemplateOptions: TemplateOptions = {
  device: null,
  template: null,
}

export type TemplateBlock = z.infer<typeof templateBlockSchema>
export type TemplateOptions = z.infer<typeof templateOptionsSchema>
export type Device = z.infer<typeof deviceSchema>
export type Template = z.infer<typeof templateSchema>
