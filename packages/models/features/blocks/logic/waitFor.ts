import { z } from 'zod'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export enum WaitForTypeEnum {
  DAY = 'DAY',
  HOUR = 'HOUR',
}

export const waitForOptionsSchema = z.object({
  number: z.string().optional(),
  type: z
    .enum([WaitForTypeEnum.DAY, WaitForTypeEnum.HOUR])
    .default(WaitForTypeEnum.HOUR),
  until: z.date().optional(),
  time: z.string().optional(),
})

export const waitForBlockSchema = blockBaseSchema.and(
  z.object({
    type: z.enum([LogicBlockType.WAIT_FOR]),
    options: waitForOptionsSchema,
  })
)

export const defaultWaitForOptions: WaitForOptions = {
  type: WaitForTypeEnum.HOUR,
}

export type WaitForBlock = z.infer<typeof waitForBlockSchema>
export type WaitForOptions = z.infer<typeof waitForOptionsSchema>
