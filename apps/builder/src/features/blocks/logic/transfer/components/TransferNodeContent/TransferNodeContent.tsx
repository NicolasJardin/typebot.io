import { Text } from '@chakra-ui/react'
import { TransferOptions } from '@typebot.io/schemas'
import { useMemo } from 'react'

type TransferNodeContentProps = {
  options: TransferOptions
}

export default function TransferNodeContent({
  options,
}: TransferNodeContentProps) {
  const name = useMemo(
    () => options.attendant?.name || options.department?.name,
    [options]
  )

  return (
    <Text color={name ? '' : 'gray.500'}>
      Transferir {name ? `para ${name}` : ''}
    </Text>
  )
}
