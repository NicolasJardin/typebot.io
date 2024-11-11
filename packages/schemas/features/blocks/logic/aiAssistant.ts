import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export const assistantSchema = z.object({
  id: z.string(),
  model: z.string(),
  name: z.string(),
})

export const aiAssistantOptionsSchema = z.object({
  assistant: assistantSchema.nullable(),
  message: z.string(),
  aiResponseVariableId: z.string(),
  instructions: z.string(),
})

export const aiAssistantBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.AI_ASSISTANT]),
    options: aiAssistantOptionsSchema,
  })
)

export const defaultAiAssistantOptions: AiAssistantOptions = {
  assistant: null,
  message: '',
  aiResponseVariableId: '',
  instructions: '',
}

export type AiAssistantBlock = z.infer<typeof aiAssistantBlockSchema>
export type AiAssistantOptions = z.infer<typeof aiAssistantOptionsSchema>
export type Assistant = z.infer<typeof assistantSchema>
