import { z } from 'zod'
import { audioBubbleBlockSchema, audioBubbleContentSchema } from './audio'
import { buttonBlockSchema, buttonOptionsSchema } from './button'
import { embedBubbleContentSchema, embedBubbleBlockSchema } from './embed'
import { imageBubbleContentSchema, imageBubbleBlockSchema } from './image'
import { textBubbleContentSchema, textBubbleBlockSchema } from './text'
import { videoBubbleContentSchema, videoBubbleBlockSchema } from './video'

export const bubbleBlockContentSchema = textBubbleContentSchema
  .or(imageBubbleContentSchema)
  .or(videoBubbleContentSchema)
  .or(embedBubbleContentSchema)
  .or(audioBubbleContentSchema)
  .or(buttonOptionsSchema)

export const bubbleBlockSchema = textBubbleBlockSchema
  .or(imageBubbleBlockSchema)
  .or(videoBubbleBlockSchema)
  .or(embedBubbleBlockSchema)
  .or(audioBubbleBlockSchema)
  .or(buttonBlockSchema)

export type BubbleBlock = z.infer<typeof bubbleBlockSchema>
export type BubbleBlockContent = z.infer<typeof bubbleBlockContentSchema>
