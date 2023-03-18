import { TextInput } from '@/components/inputs'
import { MoreInfoTooltip } from '@/components/MoreInfoTooltip'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import { ChoiceInputOptions, Variable } from '@typebot.io/schemas'
import React from 'react'

type Props = {
  options?: ChoiceInputOptions
  onOptionsChange: (options: ChoiceInputOptions) => void
}

export const ButtonsBlockSettings = ({ options, onOptionsChange }: Props) => {
  const handleIsMultipleChange = (isMultipleChoice: boolean) =>
    options && onOptionsChange({ ...options, isMultipleChoice })
  const handleButtonLabelChange = (buttonLabel: string) =>
    options && onOptionsChange({ ...options, buttonLabel })
  const handleVariableChange = (variable?: Variable) =>
    options && onOptionsChange({ ...options, variableId: variable?.id })
  const handleDynamicVariableChange = (variable?: Variable) =>
    options && onOptionsChange({ ...options, dynamicVariableId: variable?.id })

  return (
    <Stack spacing={4}>
      <SwitchWithLabel
        label="Múltipla escolha?"
        initialValue={options?.isMultipleChoice ?? false}
        onCheckChange={handleIsMultipleChange}
      />
      {options?.isMultipleChoice && (
        <TextInput
          label="Rótulo do botão:"
          defaultValue={options?.buttonLabel ?? 'Enviar'}
          onChange={handleButtonLabelChange}
        />
      )}
      <FormControl>
        <FormLabel>
          Dynamic items from variable:{' '}
          <MoreInfoTooltip>
            If defined, buttons will be dynamically displayed based on what the
            variable contains.
          </MoreInfoTooltip>
        </FormLabel>
        <VariableSearchInput
          initialVariableId={options?.dynamicVariableId}
          onSelectVariable={handleDynamicVariableChange}
        />
      </FormControl>
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
