import { Text } from '@chakra-ui/react'
import { AiAssistantOptions } from '@typebot.io/schemas'

type AiAssistantNodeContentProps = { options: AiAssistantOptions }

export default function AiAssistantNodeContent({
  options,
}: AiAssistantNodeContentProps) {
  return (
    <Text>
      Assistente IA{' '}
      {options.assistant?.name ? `- ${options.assistant?.name}` : ''}
    </Text>
  )
}
