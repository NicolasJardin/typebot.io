import { TextInput } from '@/components/inputs'
import { TableListItemProps } from '@/components/TableList'
import { Stack } from '@chakra-ui/react'
import { KeyValue } from 'models'

export const QueryParamsInputs = (props: TableListItemProps<KeyValue>) => (
  <KeyValueInputs
    {...props}
    keyPlaceholder="Ex: email"
    valuePlaceholder="Ex: {{Email}}"
  />
)

export const HeadersInputs = (props: TableListItemProps<KeyValue>) => (
  <KeyValueInputs
    {...props}
    keyPlaceholder="Ex: Content-Type"
    valuePlaceholder="Ex: application/json"
  />
)

export const KeyValueInputs = ({
  item,
  onItemChange,
  keyPlaceholder,
  valuePlaceholder,
  debounceTimeout,
}: TableListItemProps<KeyValue> & {
  keyPlaceholder?: string
  valuePlaceholder?: string
}) => {
  const handleKeyChange = (key: string) => {
    if (key === item.key) return
    onItemChange({ ...item, key })
  }
  const handleValueChange = (value: string) => {
    if (value === item.value) return
    onItemChange({ ...item, value })
  }
  return (
    <Stack p="4" rounded="md" flex="1" borderWidth="1px">
      <TextInput
        label="Chave:"
        defaultValue={item.key ?? ''}
        onChange={handleKeyChange}
        placeholder={keyPlaceholder}
        debounceTimeout={debounceTimeout}
      />
      <TextInput
        label="Valor:"
        defaultValue={item.value ?? ''}
        onChange={handleValueChange}
        placeholder={valuePlaceholder}
        debounceTimeout={debounceTimeout}
      />
    </Stack>
  )
}
