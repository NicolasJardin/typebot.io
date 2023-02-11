import { FormLabel, Stack, Text } from '@chakra-ui/react'
import { CodeEditor } from '@/components/CodeEditor'
import React from 'react'
import { SwitchWithLabel } from '@/components/SwitchWithLabel'
import { Input } from '@/components/inputs'
import { ScriptOptions } from 'models'

type Props = {
  options: ScriptOptions
  onOptionsChange: (options: ScriptOptions) => void
}

export const ScriptSettings = ({ options, onOptionsChange }: Props) => {
  const handleNameChange = (name: string) =>
    onOptionsChange({ ...options, name })
  const handleCodeChange = (content: string) =>
    onOptionsChange({ ...options, content })
  const handleShouldExecuteInParentContextChange = (
    shouldExecuteInParentContext: boolean
  ) => onOptionsChange({ ...options, shouldExecuteInParentContext })

  return (
    <Stack spacing={4}>
      <Stack>
        <FormLabel mb="0" htmlFor="name">
          Name:
        </FormLabel>
        <Input
          id="name"
          defaultValue={options.name}
          onChange={handleNameChange}
          withVariableButton={false}
        />
      </Stack>
      <SwitchWithLabel
        label="Executar na janela pai"
        moreInfoContent="Execute o código no contexto da janela pai (quando o bot estiver incorporado). Se não for detectado, o código será executado no contexto da janela atual."
        initialValue={options.shouldExecuteInParentContext ?? false}
        onCheckChange={handleShouldExecuteInParentContextChange}
      />
      <Stack>
        <Text>Código:</Text>
        <CodeEditor
          value={options.content ?? ''}
          lang="js"
          onChange={handleCodeChange}
        />
      </Stack>
    </Stack>
  )
}
