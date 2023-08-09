import { Text } from '@chakra-ui/react'
import { TransferGroupEnum, TransferOptions } from '@typebot.io/schemas'
import { useMemo } from 'react'

type TransferNodeContentProps = {
  options: TransferOptions
}

export default function TransferNodeContent({
  options,
}: TransferNodeContentProps) {
  const hasValue = useMemo(
    () =>
      !!options.attendant?.name ||
      !!options.department?.name ||
      options.group?.type,
    [options]
  )

  const name = useMemo(() => {
    switch (options.group?.type) {
      case TransferGroupEnum.FINISHED:
        return 'finalizados'
    }

    return options.attendant?.name || options.department?.name
  }, [options])

  return (
    <Text color={hasValue ? '' : 'gray.500'}>
      Transferir {name ? `para ${name}` : ''}
    </Text>
  )
}
