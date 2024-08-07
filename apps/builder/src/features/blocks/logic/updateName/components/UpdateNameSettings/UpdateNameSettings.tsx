import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import { UpdateNameOptions, Variable } from '@typebot.io/schemas'

type UpdateNameSettingsProps = {
  options: UpdateNameOptions | undefined
  onOptionsChange: (options: UpdateNameOptions) => void
}

export default function UpdateNameSettings({
  options,
  onOptionsChange,
}: UpdateNameSettingsProps) {
  const handleVariableChange = (variable?: Variable) => {
    onOptionsChange({
      variable: variable
        ? {
            ...variable,
            value: typeof variable.value === 'string' ? variable.value : null,
          }
        : null,
    })
  }

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Alterar nome para</FormLabel>

        <VariableSearchInput
          initialVariableId={options?.variable?.id}
          onSelectVariable={handleVariableChange}
        />
      </FormControl>
    </Stack>
  )
}
