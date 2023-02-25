import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { BubbleBlockType } from './enums'

export const buttonOptionsSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
})

export const buttonBlockSchema = blockBaseSchema.and(
  z.object({
    type: z.enum([BubbleBlockType.BUTTON]),
    options: buttonOptionsSchema,
  })
)

export const defaultButtonBubbleContent = {}

export type ButtonBlock = z.infer<typeof buttonBlockSchema>
export type ButtonOptions = z.infer<typeof buttonOptionsSchema>
