import { Textarea, TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import useGetAssistants from '@/whatsflow/api/ai/queries/useGetAssistants'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { AiAssistantOptions, Assistant, Variable } from '@typebot.io/schemas'
import { getCookie } from 'cookies-next'
import { useCallback } from 'react'
import jwt_decode from 'jwt-decode'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'

type AiAssistantSettingsProps = {
  options: AiAssistantOptions
  onOptionsChange: (options: AiAssistantOptions) => void
}

export default function AiAssistantSettings({
  options,
  onOptionsChange,
}: AiAssistantSettingsProps) {
  const jwt = getCookie('authJwt')

  const companyId =
    typeof jwt === 'string' ? jwt_decode<AuthJwt>(jwt).companyUuid : ''

  const token = typeof jwt === 'string' ? jwt_decode<AuthJwt>(jwt).token : ''

  const { data: assistantsData, isFetching: isFetchingAssistants } =
    useGetAssistants()

  console.log({ companyId, token, options })

  const handleChangeAssistant = useCallback(
    (assistant: Assistant) =>
      onOptionsChange({
        ...options,
        assistant,
        companyId,
        token,
      }),
    [onOptionsChange, options, companyId, token]
  )

  const handleChangeMessage = useCallback(
    (message: string) =>
      onOptionsChange({
        ...options,
        message,
      }),
    [onOptionsChange, options]
  )

  const handleChangeInstructions = useCallback(
    (instructions: string) =>
      onOptionsChange({
        ...options,
        instructions,
      }),
    [onOptionsChange, options]
  )

  const handleChangeAiResponseVariableId = useCallback(
    (variable?: Variable) =>
      onOptionsChange({
        ...options,
        aiResponseVariableId: variable?.id || '',
      }),
    [onOptionsChange, options]
  )

  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Assistente IA:</FormLabel>

        <Select
          placeholder={
            (assistantsData?.assistants &&
              assistantsData?.assistants.length > 0) ||
            isFetchingAssistants
              ? 'Selecione um dispositivo'
              : 'Sem resultados'
          }
          icon={isFetchingAssistants ? <Spinner /> : undefined}
          value={options.assistant?.id || undefined}
          onChange={(event) => {
            const newAssistant = assistantsData?.assistants.find(
              ({ id }) => id === event.target.value
            )

            handleChangeAssistant(newAssistant!)
          }}
        >
          {assistantsData?.assistants.map((assistant) => (
            <option key={assistant.id} value={assistant.id}>
              {assistant.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <Textarea
        label="Instruções:"
        defaultValue={options?.instructions}
        onChange={handleChangeInstructions}
      />

      <TextInput
        defaultValue={options?.message}
        onChange={handleChangeMessage}
        label="Mensagem:"
      />

      <FormControl>
        <FormLabel>Resposta da IA</FormLabel>
        <VariableSearchInput
          initialVariableId={options?.aiResponseVariableId}
          onSelectVariable={handleChangeAiResponseVariableId}
          placeholder="Pesquisar uma variavel"
        />
      </FormControl>
    </Stack>
  )
}
