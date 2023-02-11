import { Input } from '@/components/inputs'
import { SwitchWithLabel } from '@/components/SwitchWithLabel'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { FormLabel, Stack } from '@chakra-ui/react'
import { ChoiceInputOptions, Variable } from 'models'
import React from 'react'

type ButtonsOptionsFormProps = {
  options?: ChoiceInputOptions
  onOptionsChange: (options: ChoiceInputOptions) => void
}

export const ButtonsOptionsForm = ({
  options,
  onOptionsChange,
}: ButtonsOptionsFormProps) => {
  const handleIsMultipleChange = (isMultipleChoice: boolean) =>
    options && onOptionsChange({ ...options, isMultipleChoice })
  const handleButtonLabelChange = (buttonLabel: string) =>
    options && onOptionsChange({ ...options, buttonLabel })
  const handleVariableChange = (variable?: Variable) =>
    options && onOptionsChange({ ...options, variableId: variable?.id })

  return (
    <Stack spacing={4}>
      <SwitchWithLabel
        label="Múltipla escolha?"
        initialValue={options?.isMultipleChoice ?? false}
        onCheckChange={handleIsMultipleChange}
      />
      {options?.isMultipleChoice && (
        <Stack>
          <FormLabel mb="0" htmlFor="button">
            Rótulo do botão:
          </FormLabel>
          <Input
            id="button"
            defaultValue={options?.buttonLabel ?? 'Enviar'}
            onChange={handleButtonLabelChange}
          />
        </Stack>
      )}
      <Stack>
        <FormLabel mb="0" htmlFor="variable">
          Salve a resposta em uma variável:
        </FormLabel>
        <VariableSearchInput
          initialVariableId={options?.variableId}
          onSelectVariable={handleVariableChange}
        />
      </Stack>
    </Stack>
  )
}
