import { findUniqueVariableValue } from '@/features/variables/findUniqueVariableValue'
import { parseVariables } from '@/features/variables/parseVariables'
import { FindTagsInContactResponse } from '@/features/whatsflow/types'
import { isDefined, isNotDefined, sendRequest } from '@typebot.io/lib'
import {
  Comparison,
  ComparisonOperators,
  Condition,
  LogicalOperator,
  Variable,
} from '@typebot.io/schemas'
import { format, isAfter, isBefore, set } from 'date-fns'

export const executeCondition =
  (variables: Variable[]) =>
  async (condition: Condition, typebotId?: string): Promise<boolean> => {
    const results = await Promise.all(
      condition.comparisons.map(
        async (comparision) =>
          await executeComparison(variables)(comparision, typebotId)
      )
    )

    return condition.logicalOperator === LogicalOperator.AND
      ? results.every((value) => value)
      : results.some((value) => value)
  }

const clear = (value: string | null) => {
  if (!value) return ''

  const normalizedString = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  const result = normalizedString
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '')
    .toLowerCase()

  return result
}

const executeComparison =
  (variables: Variable[]) =>
  async (comparison: Comparison, typebotId?: string): Promise<boolean> => {
    if (
      !comparison?.variableId &&
      comparison.comparisonOperator !== ComparisonOperators.LATER_THAN &&
      comparison.comparisonOperator !== ComparisonOperators.SOONER_THAN
    )
      return false

    const inputValue =
      variables.find((v) => v.id === comparison.variableId)?.value ?? null

    const value =
      comparison.value === 'undefined' || comparison.value === 'null'
        ? null
        : findUniqueVariableValue(variables)(comparison.value) ??
          parseVariables(variables)(comparison.value)

    if (isNotDefined(comparison.comparisonOperator)) return false

    switch (comparison.comparisonOperator) {
      case ComparisonOperators.CONTAINS: {
        const contains = (a: string | null, b: string | null) => {
          if (b === '' || !b || !a) return false
          return clear(a).includes(clear(b))
        }
        return compare(contains, inputValue, value, 'some')
      }
      case ComparisonOperators.NOT_CONTAINS: {
        const notContains = (a: string | null, b: string | null) => {
          if (b === '' || !b || !a) return true
          return !clear(a)
            .toLowerCase()
            .trim()
            .includes(clear(b).toLowerCase().trim())
        }
        return compare(notContains, inputValue, value)
      }
      case ComparisonOperators.EQUAL: {
        return compare((a, b) => clear(a) === clear(b), inputValue, value)
      }
      case ComparisonOperators.NOT_EQUAL: {
        return compare((a, b) => clear(a) !== clear(b), inputValue, value)
      }
      case ComparisonOperators.GREATER: {
        if (isNotDefined(inputValue) || isNotDefined(value)) return false
        if (typeof inputValue === 'string') {
          if (typeof value === 'string')
            return parseDateOrNumber(inputValue) > parseDateOrNumber(value)
          return Number(inputValue) > value.length
        }
        if (typeof value === 'string') return inputValue.length > Number(value)
        return inputValue.length > value.length
      }
      case ComparisonOperators.LESS: {
        if (isNotDefined(inputValue) || isNotDefined(value)) return false
        if (typeof inputValue === 'string') {
          if (typeof value === 'string')
            return parseDateOrNumber(inputValue) < parseDateOrNumber(value)
          return Number(inputValue) < value.length
        }
        if (typeof value === 'string') return inputValue.length < Number(value)
        return inputValue.length < value.length
      }
      case ComparisonOperators.IS_SET: {
        return isDefined(inputValue) && inputValue.length > 0
      }
      case ComparisonOperators.IS_EMPTY: {
        return isNotDefined(inputValue) || inputValue.length === 0
      }
      case ComparisonOperators.WITHOUT_ANSWER: {
        return inputValue === 'sem resposta'
      }
      case ComparisonOperators.STARTS_WITH: {
        const startsWith = (a: string | null, b: string | null) => {
          if (b === '' || !b || !a) return false
          return clear(a)
            .toLowerCase()
            .trim()
            .startsWith(clear(b).toLowerCase().trim())
        }
        return compare(startsWith, inputValue, value)
      }
      case ComparisonOperators.ENDS_WITH: {
        const endsWith = (a: string | null, b: string | null) => {
          if (b === '' || !b || !a) return false
          return clear(a)
            .toLowerCase()
            .trim()
            .endsWith(clear(b).toLowerCase().trim())
        }
        return compare(endsWith, inputValue, value)
      }
      case ComparisonOperators.MATCHES_REGEX: {
        const matchesRegex = (a: string | null, b: string | null) => {
          if (b === '' || !b || !a) return false
          return new RegExp(b).test(a)
        }
        return compare(matchesRegex, inputValue, value, 'some')
      }
      case ComparisonOperators.NOT_MATCH_REGEX: {
        const matchesRegex = (a: string | null, b: string | null) => {
          if (b === '' || !b || !a) return false
          return !new RegExp(b).test(a)
        }
        return compare(matchesRegex, inputValue, value)
      }
      case ComparisonOperators.CONTAINS_TAG: {
        const chatId = variables.find(({ name }) => name === 'chatId')?.value

        if (!chatId || !typebotId) return false

        const response = await sendRequest<FindTagsInContactResponse>({
          url: `${process.env.NEXT_PUBLIC_VIEWER_URL}/api/whatsflow/find-tags-in-contact/${typebotId}/${chatId}`,
          method: 'GET',
        })

        const tags = response.data?.tags || []

        return tags.some((tag) => tag.title === value)
      }
      case ComparisonOperators.LATER_THAN: {
        if (!value || typeof value !== 'string') return false

        const inputTime = getTimeFromString(value)
        const currentTime = getTimeFromString(format(new Date(), 'HH:mm'))

        return isAfter(currentTime, inputTime)
      }
      case ComparisonOperators.SOONER_THAN: {
        if (!value || typeof value !== 'string') return false

        const inputTime = getTimeFromString(value)
        const currentTime = getTimeFromString(format(new Date(), 'HH:mm'))

        return isBefore(currentTime, inputTime)
      }
    }
  }

const compare = (
  compareStrings: (a: string | null, b: string | null) => boolean,
  a: Exclude<Variable['value'], undefined>,
  b: Exclude<Variable['value'], undefined>,
  type: 'every' | 'some' = 'every'
): boolean => {
  if (!a || typeof a === 'string') {
    if (!b || typeof b === 'string') return compareStrings(a, b)
    return type === 'every'
      ? b.every((b) => compareStrings(a, b))
      : b.some((b) => compareStrings(a, b))
  }
  if (!b || typeof b === 'string') {
    return type === 'every'
      ? a.every((a) => compareStrings(a, b))
      : a.some((a) => compareStrings(a, b))
  }
  if (type === 'every')
    return a.every((a) => b.every((b) => compareStrings(a, b)))
  return a.some((a) => b.some((b) => compareStrings(a, b)))
}

const parseDateOrNumber = (value: string): number => {
  const parsed = Number(value)
  if (isNaN(parsed)) {
    const time = Date.parse(value)
    return time
  }
  return parsed
}

function getTimeFromString(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  return set(new Date(0), { hours, minutes })
}
