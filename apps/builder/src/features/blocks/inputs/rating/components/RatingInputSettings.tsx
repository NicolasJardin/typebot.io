import { FormLabel, Stack } from '@chakra-ui/react'
import { DropdownList } from '@/components/DropdownList'
import { RatingInputOptions, Variable } from '@typebot.io/schemas'
import React from 'react'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'

type Props = {
  options: RatingInputOptions
  onOptionsChange: (options: RatingInputOptions) => void
}

export const RatingInputSettings = ({ options, onOptionsChange }: Props) => {
  const handleLengthChange = (length: number) =>
    onOptionsChange({ ...options, length })

  const handleTypeChange = (buttonType: 'Icones' | 'Números') =>
    onOptionsChange({ ...options, buttonType })

  const handleCustomIconCheck = (isEnabled: boolean) =>
    onOptionsChange({
      ...options,
      customIcon: { ...options.customIcon, isEnabled },
    })

  const handleIconSvgChange = (svg: string) =>
    onOptionsChange({ ...options, customIcon: { ...options.customIcon, svg } })

  const handleLeftLabelChange = (left: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, left } })

  const handleRightLabelChange = (right: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, right } })

  const handleButtonLabelChange = (button: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, button } })

  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })

  const handleOneClickSubmitChange = (isOneClickSubmitEnabled: boolean) =>
    onOptionsChange({ ...options, isOneClickSubmitEnabled })

  return (
    <Stack spacing={4}>
      <Stack>
        <FormLabel mb="0" htmlFor="button">
          Máximo:
        </FormLabel>
        <DropdownList
          onItemSelect={handleLengthChange}
          items={[3, 4, 5, 6, 7, 8, 9, 10]}
          currentItem={options.length}
        />
      </Stack>

      <Stack>
        <FormLabel mb="0" htmlFor="button">
          Tipo:
        </FormLabel>
        <DropdownList
          onItemSelect={handleTypeChange}
          items={['Icones', 'Números'] as const}
          currentItem={options.buttonType}
        />
      </Stack>

      {options.buttonType === 'Icones' && (
        <SwitchWithLabel
          label="Ícone personalizado?"
          initialValue={options.customIcon.isEnabled}
          onCheckChange={handleCustomIconCheck}
        />
      )}
      {options.buttonType === 'Icones' && options.customIcon.isEnabled && (
        <TextInput
          label="Icone SVG:"
          defaultValue={options.customIcon.svg}
          onChange={handleIconSvgChange}
          placeholder="<svg>...</svg>"
        />
      )}
      <TextInput
        label={`${options.buttonType === 'Icones' ? '1' : '0'} label:`}
        defaultValue={options.labels.left}
        onChange={handleLeftLabelChange}
        placeholder="Não é nada provável"
      />
      <TextInput
        label={`${options.length} label:`}
        defaultValue={options.labels.right}
        onChange={handleRightLabelChange}
        placeholder="Extremely likely"
      />
      <SwitchWithLabel
        label="Um clique para enviar"
        moreInfoContent='Se habilitada, a resposta será enviada assim que o usuário clicar em uma avaliação ao invés de mostrar o botão "Enviar".'
        initialValue={options.isOneClickSubmitEnabled ?? false}
        onCheckChange={handleOneClickSubmitChange}
      />
      {!options.isOneClickSubmitEnabled && (
        <TextInput
          label="Rótulo do botão:"
          defaultValue={options.labels.button}
          onChange={handleButtonLabelChange}
        />
      )}
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
