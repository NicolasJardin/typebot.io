import { TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { FormLabel, Stack } from '@chakra-ui/react'
import { EmailInputOptions, Variable } from 'models'
import React from 'react'

type EmailInputSettingsBodyProps = {
  options: EmailInputOptions
  onOptionsChange: (options: EmailInputOptions) => void
}

export const EmailInputSettingsBody = ({
  options,
  onOptionsChange,
}: EmailInputSettingsBodyProps) => {
  const handlePlaceholderChange = (placeholder: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, placeholder } })
  const handleButtonLabelChange = (button: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, button } })
  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })
  const handleRetryMessageChange = (retryMessageContent: string) =>
    onOptionsChange({ ...options, retryMessageContent })

  return (
    <Stack spacing={4}>
      <TextInput
        label="Espaço reservado:"
        defaultValue={options.labels.placeholder}
        onChange={handlePlaceholderChange}
      />
      <TextInput
        label="Rótulo do botão:"
        defaultValue={options.labels.button}
        onChange={handleButtonLabelChange}
      />
      <TextInput
        label="Retry message:"
        defaultValue={options.retryMessageContent}
        onChange={handleRetryMessageChange}
      />
      <Stack>
        <FormLabel mb="0" htmlFor="variable">
          Salvar resposta em uma variável:
        </FormLabel>
        <VariableSearchInput
          initialVariableId={options.variableId}
          onSelectVariable={handleVariableChange}
        />
      </Stack>
    </Stack>
  )
}
