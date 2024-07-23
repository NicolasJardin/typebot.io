import { DropdownList } from '@/components/DropdownList'
import { TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { TableListItemProps } from '@/components/TableList'
import { TagSearchInput } from '@/components/TagSearchInput'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { Select, Stack } from '@chakra-ui/react'
import { Comparison, ComparisonOperators, Variable } from '@typebot.io/schemas'
import { addDays, set, startOfWeek, parseISO } from 'date-fns'
import { fromZonedTime, format } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

export const ComparisonItem = ({
  item,
  onItemChange,
}: TableListItemProps<Comparison>) => {
  const { typebot } = useTypebot()

  const handleSelectVariable = (variable?: Variable) => {
    if (variable?.id === item.variableId) return
    onItemChange({ ...item, variableId: variable?.id })
  }

  const handleSelectComparisonOperator = (
    comparisonOperator: ComparisonOperators
  ) => {
    if (comparisonOperator === item.comparisonOperator) return
    onItemChange({
      ...item,
      comparisonOperator,
      variableId:
        comparisonOperator !== ComparisonOperators.CONTAINS_TAG
          ? item.variableId
          : typebot?.variables.find(({ name }) => name === 'chatId')?.id ||
            item.variableId,
    })
  }

  function formatTime(time: string): string {
    const cleanedTime = time.replace(/\D/g, '')

    const limitedTime = cleanedTime.slice(0, 4)

    if (limitedTime.length <= 2) {
      return limitedTime
    }

    return limitedTime.slice(0, 2) + ':' + limitedTime.slice(2)
  }

  const handleChangeValue = (value: string) => {
    if (value === item.value) return

    if (
      item.comparisonOperator === ComparisonOperators.SOONER_THAN ||
      item.comparisonOperator === ComparisonOperators.LATER_THAN
    ) {
      const formattedValue = formatTime(value)

      if (formattedValue.length >= 5) {
        const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const [hours, minutes] = formattedValue.split(':').map(Number)
        const utcDateTime = fromZonedTime(
          set(new Date(), { hours, minutes }),
          systemTimeZone
        )

        return onItemChange({ ...item, value: utcDateTime.toISOString() })
      }
    }

    onItemChange({ ...item, value })
  }

  const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 })

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeekDate, i)
    return format(date, 'EEEE', { locale: ptBR })
  })

  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      {item.comparisonOperator !== ComparisonOperators.CONTAINS_TAG &&
        item.comparisonOperator !== ComparisonOperators.LATER_THAN &&
        item.comparisonOperator !== ComparisonOperators.SOONER_THAN &&
        item.comparisonOperator !== ComparisonOperators.DAY_OF_THE_WEEK && (
          <VariableSearchInput
            initialVariableId={item.variableId}
            onSelectVariable={handleSelectVariable}
            placeholder="Pesquisar uma variável"
          />
        )}
      <DropdownList
        currentItem={item.comparisonOperator}
        onItemSelect={handleSelectComparisonOperator}
        items={Object.values(ComparisonOperators).filter(
          (comparision) =>
            comparision !== ComparisonOperators.IS_EMPTY &&
            comparision !== ComparisonOperators.IS_SET
        )}
        placeholder="Selecione um operador"
      />
      {item.comparisonOperator !== ComparisonOperators.IS_SET &&
        item.comparisonOperator !== ComparisonOperators.IS_EMPTY &&
        item.comparisonOperator !== ComparisonOperators.WITHOUT_ANSWER &&
        item.comparisonOperator !== ComparisonOperators.CONTAINS_TAG &&
        item.comparisonOperator !== ComparisonOperators.DAY_OF_THE_WEEK && (
          <TextInput
            defaultValue={
              item.comparisonOperator === ComparisonOperators.LATER_THAN ||
              item.comparisonOperator === ComparisonOperators.SOONER_THAN
                ? format(parseISO(item.value), 'HH:mm', {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  }) ?? ''
                : item.value ?? ''
            }
            onChange={handleChangeValue}
            placeholder={parseValuePlaceholder(item.comparisonOperator)}
          />
        )}

      {item.comparisonOperator === ComparisonOperators.CONTAINS_TAG && (
        <TagSearchInput
          onSelectTag={(tag) => handleChangeValue(tag.name!)}
          defaultTagName={item.value ?? ''}
          id="tag-search"
        />
      )}

      {item.comparisonOperator === ComparisonOperators.DAY_OF_THE_WEEK && (
        <Select
          placeholder="Selecione o dia da semana"
          value={item.value}
          onChange={(event) => {
            const newValue = event.target.value

            handleChangeValue(newValue)
          }}
        >
          {weekDates.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </Select>
      )}
    </Stack>
  )
}

const parseValuePlaceholder = (
  operator: ComparisonOperators | undefined
): string => {
  switch (operator) {
    case ComparisonOperators.NOT_EQUAL:
    case ComparisonOperators.EQUAL:
    case ComparisonOperators.CONTAINS:
    case ComparisonOperators.STARTS_WITH:
    case ComparisonOperators.ENDS_WITH:
    case ComparisonOperators.NOT_CONTAINS:
    case ComparisonOperators.CONTAINS_TAG:
    case undefined:
      return 'Digite um valor...'
    case ComparisonOperators.LESS:
    case ComparisonOperators.GREATER:
      return 'Digite um número...'
    case ComparisonOperators.IS_SET:
    case ComparisonOperators.IS_EMPTY:
    case ComparisonOperators.WITHOUT_ANSWER:
      return ''
    case ComparisonOperators.MATCHES_REGEX:
    case ComparisonOperators.NOT_MATCH_REGEX:
      return '^[0-9]+$'
    case ComparisonOperators.LATER_THAN:
    case ComparisonOperators.SOONER_THAN:
      return 'Digite um horário (HH:mm)'
    case ComparisonOperators.DAY_OF_THE_WEEK:
      return 'Escolha um dia da semana'
  }
}
