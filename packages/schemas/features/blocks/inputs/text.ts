import { z } from 'zod'
import { blockBaseSchema, optionBaseSchema } from '../baseSchemas'
import { defaultButtonLabel } from './constants'
import { InputBlockType } from './enums'
import { WaitForTypeEnum } from './waitFor'

export const textInputOptionsBaseSchema = z.object({
  labels: z.object({
    placeholder: z.string(),
    button: z.string(),
  }),
})

export const textInputOptionsSchema = textInputOptionsBaseSchema
  .merge(optionBaseSchema)
  .merge(
    z.object({
      isLong: z.boolean(),
    })
  )
  .merge(
    z.object({
      wait: z
        .object({
          number: z.number().optional(),
          type: z
            .enum([
              WaitForTypeEnum.DAY,
              WaitForTypeEnum.HOUR,
              WaitForTypeEnum.MINUTE,
            ])
            .default(WaitForTypeEnum.HOUR),
          until: z.string().optional(),
          time: z.string().optional(),
        })
        .optional()
        .nullable(),
    })
  )

export const defaultTextInputOptions: TextInputOptions = {
  isLong: false,
  wait: {
    type: WaitForTypeEnum.HOUR,
  },
  labels: { button: defaultButtonLabel, placeholder: 'Digite sua resposta...' },
}

export const textInputSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([InputBlockType.TEXT]),
    options: textInputOptionsSchema,
  })
)

export type TextInputBlock = z.infer<typeof textInputSchema>
export type TextInputOptions = z.infer<typeof textInputOptionsSchema>
