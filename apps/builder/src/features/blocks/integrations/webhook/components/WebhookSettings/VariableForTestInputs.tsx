import { TextInput } from '@/components/inputs'
import { TableListItemProps } from '@/components/TableList'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { Stack, FormControl, FormLabel } from '@chakra-ui/react'
import { VariableForTest, Variable } from 'models'

export const VariableForTestInputs = ({
  item,
  onItemChange,
  debounceTimeout,
}: TableListItemProps<VariableForTest>) => {
  const handleVariableSelect = (variable?: Variable) =>
    onItemChange({ ...item, variableId: variable?.id })
  const handleValueChange = (value: string) => {
    if (value === item.value) return
    onItemChange({ ...item, value })
  }
  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <FormControl>
        <FormLabel htmlFor={'name' + item.id}>Nome da variável:</FormLabel>
        <VariableSearchInput
          id={'name' + item.id}
          initialVariableId={item.variableId}
          onSelectVariable={handleVariableSelect}
        />
      </FormControl>
      <TextInput
        label="Valor teste:"
        defaultValue={item.value ?? ''}
        onChange={handleValueChange}
        debounceTimeout={debounceTimeout}
      />
    </Stack>
  )
}
