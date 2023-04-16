import { Text } from '@chakra-ui/react'
import { SpreadOptions } from '@typebot.io/schemas'

type SpreadNodeContentProps = {
  options: SpreadOptions
}

export default function SpreadNodeContent({
  options: { attendants },
}: SpreadNodeContentProps) {
  return <Text color={attendants.length ? '' : 'gray.500'}>Distribuir</Text>
}
