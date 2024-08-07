import { Text } from '@chakra-ui/react'
import { UpdateNameOptions } from '@typebot.io/schemas'

type UpdateNameNodeContentProps = { options: UpdateNameOptions }

export default function UpdateNameNodeContent({
  options,
}: UpdateNameNodeContentProps) {
  return (
    <Text color={options.variable ? '' : 'gray.500'}>
      Alterar nome{' '}
      {options.variable?.name ? `para ${options.variable?.name}` : ''}
    </Text>
  )
}
