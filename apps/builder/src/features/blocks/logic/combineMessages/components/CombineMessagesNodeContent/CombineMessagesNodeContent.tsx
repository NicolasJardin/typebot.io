import { HStack, Icon, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { CombineMessagesOptions } from '@typebot.io/schemas'
import { MdTranscribe } from 'react-icons/md'

type CombineMessagesNodeContentProps = { options: CombineMessagesOptions }

export default function CombineMessagesNodeContent({
  options,
}: CombineMessagesNodeContentProps) {
  const purple = useColorModeValue('purple.500', 'purple.300')

  return (
    <HStack
      spacing={2}
      alignItems="flex-start"
      justifyContent="space-between"
      width="100%"
    >
      <Stack gap={0}>
        <Text>Combinar mensagens</Text>

        {Boolean(options.waitSeconds) && (
          <Text>({options.waitSeconds} segundos)</Text>
        )}
      </Stack>

      {options.transcribeAudio && (
        <Icon as={MdTranscribe} color={purple} mt={1} />
      )}
    </HStack>
  )
}
