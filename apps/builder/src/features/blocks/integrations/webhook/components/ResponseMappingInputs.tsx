import { AutocompleteInput } from '@/components/inputs/AutocompleteInput'
import { TableListItemProps } from '@/components/TableList'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { Stack, FormControl, FormLabel } from '@chakra-ui/react'
import { Variable, ResponseVariableMapping } from '@typebot.io/schemas'

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
        <AutocompleteInput
          items={dataItems}
          defaultValue={item.bodyPath}
          onChange={handleBodyPathChange}
          placeholder="Seleciona os dados"
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
