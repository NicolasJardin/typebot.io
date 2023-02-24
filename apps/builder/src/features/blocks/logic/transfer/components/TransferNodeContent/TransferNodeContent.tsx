import { Text } from '@chakra-ui/react'
import { TransferOptions } from 'models'

type TransferNodeContentProps = {
  options: TransferOptions
}

export default function TransferNodeContent({
  options,
}: TransferNodeContentProps) {
  return <Text color={'gray.500'}>Transferir</Text>
}
