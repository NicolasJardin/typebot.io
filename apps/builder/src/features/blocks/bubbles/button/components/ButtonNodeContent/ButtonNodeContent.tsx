import { Text } from '@chakra-ui/react'
import { ButtonOptions } from '@typebot.io/schemas'

type ButtonNodeContentProps = {
  options: ButtonOptions
}

export default function ButtonNodeContent({ options }: ButtonNodeContentProps) {
  return (
    <Text color={options.title ? '' : 'gray.500'}>
      {options.title || 'Botão para ação'}
    </Text>
  )
}
