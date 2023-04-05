import { Text } from '@chakra-ui/react'
import { SpreadOptions } from '@typebot.io/schemas'

type SpreadNodeContentProps = {
  options: SpreadOptions
}

export default function SpreadNodeContent({
  options: { attendant },
}: SpreadNodeContentProps) {
  return (
    <Text color={attendant.name ? '' : 'gray.500'}>
      Distribuir {attendant.name ? `para ${attendant.name}` : ''}
    </Text>
  )
}
