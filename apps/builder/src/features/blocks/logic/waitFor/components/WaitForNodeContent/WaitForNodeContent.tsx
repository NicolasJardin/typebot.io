import { Text } from '@chakra-ui/react'
import { WaitForOptions, WaitForTypeEnum } from 'models'

type WaitForNodeContentProps = {
  options: WaitForOptions
}

export default function WaitForNodeContent({
  options: { type, number },
}: WaitForNodeContentProps) {
  return (
    <Text color={number ? 'currentcolor' : 'gray.500'}>
      {number
        ? `Aguardar por ${number} ${
            type === WaitForTypeEnum.DAY ? 'dias' : 'horas'
          }`
        : 'Aguardar'}
    </Text>
  )
}
