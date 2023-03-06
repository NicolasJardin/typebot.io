import { TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { FormLabel, Stack } from '@chakra-ui/react'
import { PhoneNumberInputOptions, Variable } from 'models'
import React from 'react'
import { CountryCodeSelect } from './CountryCodeSelect'

type PhoneNumberSettingsBodyProps = {
  options: PhoneNumberInputOptions
  onOptionsChange: (options: PhoneNumberInputOptions) => void
}

export const PhoneNumberSettingsBody = ({
  options,
  onOptionsChange,
}: PhoneNumberSettingsBodyProps) => {
  const handlePlaceholderChange = (placeholder: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, placeholder } })
  const handleButtonLabelChange = (button: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, button } })
  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })
  const handleRetryMessageChange = (retryMessageContent: string) =>
    onOptionsChange({ ...options, retryMessageContent })
  const handleDefaultCountryChange = (defaultCountryCode: string) =>
    onOptionsChange({ ...options, defaultCountryCode })

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
      <Stack>
        <FormLabel mb="0" htmlFor="button">
          País padrão :
        </FormLabel>
        <CountryCodeSelect
          onSelect={handleDefaultCountryChange}
          countryCode={options.defaultCountryCode}
        />
      </Stack>
      <TextInput
        label="Repetir mensagem:"
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
