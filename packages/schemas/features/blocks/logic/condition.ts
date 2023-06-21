import { z } from 'zod'
import { ItemType } from '../../items/enums'
import { itemBaseSchema } from '../../items/baseSchemas'
import { blockBaseSchema } from '../baseSchemas'
import { LogicBlockType } from './enums'

export enum LogicalOperator {
  OR = 'OU',
  AND = 'E',
}

export enum ComparisonOperators {
  EQUAL = 'Igual a',
  NOT_EQUAL = 'Não igual',
  CONTAINS = 'Contém',
  NOT_CONTAINS = 'Não Contém',
  GREATER = 'Maior que',
  LESS = 'Menor que',
  IS_SET = 'Está definido',
  IS_EMPTY = 'Is empty',
  STARTS_WITH = 'Inicia com',
  ENDS_WITH = 'Termina com',
}

const comparisonSchema = z.object({
  id: z.string(),
  variableId: z.string().optional(),
  comparisonOperator: z.nativeEnum(ComparisonOperators).optional(),
  value: z.string().optional(),
})

export const conditionSchema = z.object({
  logicalOperator: z.nativeEnum(LogicalOperator),
  comparisons: z.array(comparisonSchema),
})

export const conditionItemSchema = itemBaseSchema.merge(
  z.object({
    type: z.literal(ItemType.CONDITION),
    content: conditionSchema,
  })
)

export const conditionBlockSchema = blockBaseSchema.merge(
  z.object({
    type: z.enum([LogicBlockType.CONDITION]),
    items: z.array(conditionItemSchema),
  })
)

export const defaultConditionContent: Condition = {
  comparisons: [],
  logicalOperator: LogicalOperator.AND,
}

export type ConditionItem = z.infer<typeof conditionItemSchema>
export type Comparison = z.infer<typeof comparisonSchema>
export type ConditionBlock = z.infer<typeof conditionBlockSchema>
export type Condition = z.infer<typeof conditionSchema>
