import { FormLabel, HStack, Stack, Switch, Text } from '@chakra-ui/react'
import { CodeEditor } from '@/components/CodeEditor'
import { SetVariableOptions, Variable } from 'models'
import React from 'react'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { Textarea } from '@/components/inputs'

type Props = {
  options: SetVariableOptions
  onOptionsChange: (options: SetVariableOptions) => void
}

export const SetVariableSettings = ({ options, onOptionsChange }: Props) => {
  const handleVariableChange = (variable?: Variable) =>
    onOptionsChange({ ...options, variableId: variable?.id })
  const handleExpressionChange = (expressionToEvaluate: string) =>
    onOptionsChange({ ...options, expressionToEvaluate })
  const handleValueTypeChange = () =>
    onOptionsChange({
      ...options,
      isCode: options.isCode ? !options.isCode : true,
    })

  return (
    <Stack spacing={4}>
      <Stack>
        <FormLabel mb="0" htmlFor="variable-search">
          Pesquisar ou criar variável:
        </FormLabel>
        <VariableSearchInput
          onSelectVariable={handleVariableChange}
          initialVariableId={options.variableId}
          id="variable-search"
        />
      </Stack>
      <Stack>
        <HStack justify="space-between">
          <FormLabel mb="0" htmlFor="expression">
            Valor:
          </FormLabel>
          <HStack>
            <Text fontSize="sm">Texto</Text>
            <Switch
              size="sm"
              isChecked={options.isCode ?? false}
              onChange={handleValueTypeChange}
            />
            <Text fontSize="sm">Código</Text>
          </HStack>
        </HStack>

        {options.isCode ?? false ? (
          <CodeEditor
            defaultValue={options.expressionToEvaluate ?? ''}
            onChange={handleExpressionChange}
            lang="javascript"
          />
        ) : (
          <Textarea
            id="expression"
            defaultValue={options.expressionToEvaluate ?? ''}
            onChange={handleExpressionChange}
          />
        )}
      </Stack>
    </Stack>
  )
}
