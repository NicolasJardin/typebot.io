import { FormLabel, HStack, Stack, Text } from '@chakra-ui/react'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { FileInputOptions, Variable } from '@typebot.io/schemas'
import React from 'react'
import { TextInput, NumberInput } from '@/components/inputs'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'

type Props = {
  options: FileInputOptions
  onOptionsChange: (options: FileInputOptions) => void
}

export const FileInputSettings = ({ options, onOptionsChange }: Props) => {
  const handleButtonLabelChange = (button: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, button } })

  const handlePlaceholderLabelChange = (placeholder: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, placeholder } })

  const handleMultipleFilesChange = (isMultipleAllowed: boolean) =>
    onOptionsChange({ ...options, isMultipleAllowed })

  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })

  const handleSizeLimitChange = (sizeLimit?: number) =>
    onOptionsChange({ ...options, sizeLimit })

  const handleRequiredChange = (isRequired: boolean) =>
    onOptionsChange({ ...options, isRequired })

  const updateClearButtonLabel = (clear: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, clear } })

  const updateSkipButtonLabel = (skip: string) =>
    onOptionsChange({ ...options, labels: { ...options.labels, skip } })

  return (
    <Stack spacing={4}>
      <SwitchWithLabel
        label="Obrigatório?"
        initialValue={options.isRequired ?? true}
        onCheckChange={handleRequiredChange}
      />
      <SwitchWithLabel
        label="Permitir vários arquivos?"
        initialValue={options.isMultipleAllowed}
        onCheckChange={handleMultipleFilesChange}
      />
      <HStack>
        <NumberInput
          label={'Limite de tamanho:'}
          defaultValue={options.sizeLimit ?? 10}
          onValueChange={handleSizeLimitChange}
          withVariableButton={false}
        />
        <Text>MB</Text>
      </HStack>

      <Stack>
        <FormLabel mb="0">espaço reservado:</FormLabel>
        <CodeEditor
          lang="html"
          onChange={handlePlaceholderLabelChange}
          defaultValue={options.labels.placeholder}
          height={'100px'}
          withVariableButton={false}
        />
      </Stack>
      <TextInput
        label="Rótulo do botão:"
        defaultValue={options.labels.button}
        onChange={handleButtonLabelChange}
        withVariableButton={false}
      />
      <TextInput
        label="Limpar rótulo do botão:"
        defaultValue={options.labels.clear ?? ''}
        onChange={updateClearButtonLabel}
        withVariableButton={false}
      />
      <TextInput
        label="Ignorar rótulo do botão:"
        defaultValue={options.labels.skip ?? ''}
        onChange={updateSkipButtonLabel}
        withVariableButton={false}
      />
      <Stack>
        <FormLabel mb="0" htmlFor="variable">
          Salvar URL de upload{options.isMultipleAllowed ? 's' : ''} em uma
          variavel
        </FormLabel>
        <VariableSearchInput
          initialVariableId={options.variableId}
          onSelectVariable={handleVariableChange}
        />
      </Stack>
    </Stack>
  )
}
