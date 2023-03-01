import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { BubbleBlockType } from './enums'

export const fileBubbleContentSchema = z.object({
  url: z.string().optional(),
})

export const fileBubbleBlockSchema = blockBaseSchema.and(
  z.object({
    type: z.enum([BubbleBlockType.FILE]),
    content: fileBubbleContentSchema,
  })
)

export const defaultFileBubbleContent = {}

export type FileBubbleBlock = z.infer<typeof fileBubbleBlockSchema>
export type FileBubbleContent = z.infer<typeof fileBubbleContentSchema>
