import { Textarea, TextInput } from '@/components/inputs'
import { VariableSearchInput } from '@/components/inputs/VariableSearchInput'
import { jwt, useCookies } from '@/features/cookies/hooks/useCookies'
import useGetAssistants from '@/whatsflow/api/ai/queries/useGetAssistants'
import { AuthJwt } from '@/whatsflow/api/base/interfaces/AuthJwt'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { AiAssistantOptions, Assistant, Variable } from '@typebot.io/schemas'
import jwt_decode from 'jwt-decode'
import { useCallback } from 'react'

type AiAssistantSettingsProps = {
  options: AiAssistantOptions
  onOptionsChange: (options: AiAssistantOptions) => void
}

export default function AiAssistantSettings({
  options,
  onOptionsChange,
}: AiAssistantSettingsProps) {
  const { companyId, token } = useCookies()

  const decodedJwt =
    typeof jwt === 'string' ? jwt_decode<AuthJwt>(jwt) : undefined

  const { data: assistantsData, isFetching: isFetchingAssistants } =
    useGetAssistants()

  function getAuthJwtCookie() {
    const cookieString = document.cookie
    const cookies = cookieString.split('; ')

    for (const cookie of cookies) {
      const [name, value] = cookie.split('=')
      if (name === 'authJwt') {
        return decodeURIComponent(value) // decodifica o valor caso tenha caracteres especiais
      }
    }

    return null // retorna null caso o cookie não exista
  }

  // Exemplo de uso:
  const authJwt = getAuthJwtCookie()
  console.log(authJwt)

  console.log({
    companyId,
    token,
    decodedJwt,
    options,
    teste: getAuthJwtCookie(),
  })

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
          {assistantsData?.assistants?.map((assistant) => (
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
