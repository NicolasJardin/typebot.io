import { SearchableDropdown } from '@/components/SearchableDropdown'
import { TableListItemProps } from '@/components/TableList'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { Stack, FormControl, FormLabel } from '@chakra-ui/react'
import { Variable, ResponseVariableMapping } from 'models'

export const DataVariableInputs = ({
  item,
  onItemChange,
  dataItems,
}: TableListItemProps<ResponseVariableMapping> & { dataItems: string[] }) => {
  const handleBodyPathChange = (bodyPath: string) =>
    onItemChange({ ...item, bodyPath })
  const handleVariableChange = (variable?: Variable) =>
    onItemChange({ ...item, variableId: variable?.id })

  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <FormControl>
        <FormLabel htmlFor="name">Dados:</FormLabel>
        <SearchableDropdown
          items={dataItems}
          value={item.bodyPath}
          onValueChange={handleBodyPathChange}
          placeholder="Selecione os dados"
          withVariableButton
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="value">Definir variável:</FormLabel>
        <VariableSearchInput
          onSelectVariable={handleVariableChange}
          placeholder="Pesquisar uma variável"
          initialVariableId={item.variableId}
        />
      </FormControl>
    </Stack>
  )
}
