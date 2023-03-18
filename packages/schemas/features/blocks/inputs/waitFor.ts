import { z } from 'zod'
import { blockBaseSchema, optionBaseSchema } from '../baseSchemas'
import { InputBlockType } from './enums'

export enum WaitForTypeEnum {
  DAY = 'DAY',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
}

export const waitForOptionsSchema = optionBaseSchema.and(
  z.object({
    number: z.number().optional(),
    type: z
      .enum([WaitForTypeEnum.DAY, WaitForTypeEnum.HOUR, WaitForTypeEnum.MINUTE])
      .default(WaitForTypeEnum.HOUR),
    until: z.string().optional(),
    time: z.string().optional(),
  })
)

export const waitForBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([InputBlockType.WAIT_FOR]),
    options: waitForOptionsSchema,
  })
)

export const defaultWaitForOptions: WaitForOptions = {
  type: WaitForTypeEnum.HOUR,
}

export type WaitForBlock = z.infer<typeof waitForBlockSchema>
export type WaitForOptions = z.infer<typeof waitForOptionsSchema>
