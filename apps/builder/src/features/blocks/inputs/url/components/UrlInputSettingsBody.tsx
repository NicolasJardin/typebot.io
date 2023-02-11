import { Input } from '@/components/inputs'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { FormLabel, Stack } from '@chakra-ui/react'
import { UrlInputOptions, Variable } from 'models'
import React from 'react'

type UrlInputSettingsBodyProps = {
  options: UrlInputOptions
  onOptionsChange: (options: UrlInputOptions) => void
}

export const UrlInputSettingsBody = ({
  options,
  onOptionsChange,
}: UrlInputSettingsBodyProps) => {
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
      <Stack>
        <FormLabel mb="0" htmlFor="placeholder">
          espaço reservado:
        </FormLabel>
        <Input
          id="placeholder"
          defaultValue={options.labels.placeholder}
          onChange={handlePlaceholderChange}
        />
      </Stack>
      <Stack>
        <FormLabel mb="0" htmlFor="button">
          Rótulo do botão:
        </FormLabel>
        <Input
          id="button"
          defaultValue={options.labels.button}
          onChange={handleButtonLabelChange}
        />
      </Stack>
      <Stack>
        <FormLabel mb="0" htmlFor="retry">
          Repetir mensagem:
        </FormLabel>
        <Input
          id="retry"
          defaultValue={options.retryMessageContent}
          onChange={handleRetryMessageChange}
        />
      </Stack>
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
