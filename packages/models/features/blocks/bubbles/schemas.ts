import { z } from 'zod'
import { audioBubbleBlockSchema, audioBubbleContentSchema } from './audio'
import { buttonBlockSchema, buttonOptionsSchema } from './button'
import { embedBubbleContentSchema, embedBubbleBlockSchema } from './embed'
import { fileBubbleBlockSchema, fileBubbleContentSchema } from './file'
import { imageBubbleContentSchema, imageBubbleBlockSchema } from './image'
import { textBubbleContentSchema, textBubbleBlockSchema } from './text'
import { videoBubbleContentSchema, videoBubbleBlockSchema } from './video'

export const bubbleBlockContentSchema = textBubbleContentSchema
  .or(imageBubbleContentSchema)
  .or(videoBubbleContentSchema)
  .or(embedBubbleContentSchema)
  .or(audioBubbleContentSchema)
  .or(buttonOptionsSchema)
  .or(fileBubbleContentSchema)

export const bubbleBlockSchema = textBubbleBlockSchema
  .or(imageBubbleBlockSchema)
  .or(videoBubbleBlockSchema)
  .or(embedBubbleBlockSchema)
  .or(audioBubbleBlockSchema)
  .or(buttonBlockSchema)
  .or(fileBubbleBlockSchema)

export const bubbleBlockOptions = buttonOptionsSchema

export type BubbleBlock = z.infer<typeof bubbleBlockSchema>
export type BubbleBlockContent = z.infer<typeof bubbleBlockContentSchema>
export type BubbleOptions = z.infer<typeof bubbleBlockOptions>
