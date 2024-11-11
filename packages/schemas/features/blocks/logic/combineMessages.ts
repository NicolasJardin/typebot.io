import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const combineMessagesOptionsSchema = z.object({
  waitSeconds: z.number().min(10).max(900),
  transcribeAudio: z.boolean(),
})

export const combineMessagesBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.COMBINE_MESSAGES]),
    options: combineMessagesOptionsSchema,
  })
)

export const defaultCombineMessagesOptions: CombineMessagesOptions = {
  transcribeAudio: false,
  waitSeconds: 10,
}

export type CombineMessagesBlock = z.infer<typeof combineMessagesBlockSchema>
export type CombineMessagesOptions = z.infer<
  typeof combineMessagesOptionsSchema
>
