import { FormLabel, Stack } from '@chakra-ui/react'
import { DropdownList } from '@/components/DropdownList'
import { RatingInputOptions, Variable } from 'models'
import React from 'react'
import { SwitchWithLabel } from '@/components/SwitchWithLabel'
import { Input } from '@/components/inputs'
import { VariableSearchInput } from '@/components/VariableSearchInput'

type RatingInputSettingsProps = {
  options: RatingInputOptions
  onOptionsChange: (options: RatingInputOptions) => void
}

export const RatingInputSettings = ({
  options,
  onOptionsChange,
}: RatingInputSettingsProps) => {
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
          items={['Icones', 'Números']}
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
        <Stack>
          <FormLabel mb="0" htmlFor="svg">
            Ícone SVG:
          </FormLabel>
          <Input
            id="svg"
            defaultValue={options.customIcon.svg}
            onChange={handleIconSvgChange}
            placeholder="<svg>...</svg>"
          />
        </Stack>
      )}
      <Stack>
        <FormLabel mb="0" htmlFor="button">
          {options.buttonType === 'Icones' ? '1' : '0'} rótulo:
        </FormLabel>
        <Input
          id="button"
          defaultValue={options.labels.left}
          onChange={handleLeftLabelChange}
          placeholder="Não é nada provável"
        />
      </Stack>
      <Stack>
        <FormLabel mb="0" htmlFor="button">
          {options.length} rótulo:
        </FormLabel>
        <Input
          id="button"
          defaultValue={options.labels.right}
          onChange={handleRightLabelChange}
          placeholder="Extremamente provável"
        />
      </Stack>
      <SwitchWithLabel
        label="Um clique para enviar"
        moreInfoContent='Se habilitada, a resposta será enviada assim que o usuário clicar em uma avaliação ao invés de mostrar o botão "Enviar".'
        initialValue={options.isOneClickSubmitEnabled ?? false}
        onCheckChange={handleOneClickSubmitChange}
      />
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
