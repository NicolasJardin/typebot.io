import { z } from 'zod'
import { optionBaseSchema, blockBaseSchema } from '../baseSchemas'
import { defaultButtonLabel } from './constants'
import { InputBlockType } from './enums'
import { textInputOptionsBaseSchema } from './text'

export const emailInputOptionsSchema = optionBaseSchema
  .merge(textInputOptionsBaseSchema)
  .merge(
    z.object({
      retryMessageContent: z.string().optional(),
    })
  )

export const emailInputSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([InputBlockType.EMAIL]),
    options: emailInputOptionsSchema,
  })
)

export const invalidEmailDefaultRetryMessage =
  "Este e-mail não parece ser válido. Você pode digitá-lo novamente?"

export const defaultEmailInputOptions: EmailInputOptions = {
  labels: {
    button: defaultButtonLabel,
    placeholder: 'Type your email...',
  },
}

export type EmailInputBlock = z.infer<typeof emailInputSchema>
export type EmailInputOptions = z.infer<typeof emailInputOptionsSchema>
