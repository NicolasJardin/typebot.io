import { Tag, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { SendEmailBlock } from 'models'

type Props = {
  block: SendEmailBlock
}

export const SendEmailContent = ({ block }: Props) => {
  if (block.options.recipients.length === 0)
    return <Text color="gray.500">Configurar...</Text>
  return (
    <Wrap noOfLines={2} pr="6">
      <WrapItem>
        <Text>Enviar um email a</Text>
      </WrapItem>
      {block.options.recipients.map((to) => (
        <WrapItem key={to}>
          <Tag>{to}</Tag>
        </WrapItem>
      ))}
    </Wrap>
  )
}
