import { Text } from '@chakra-ui/react'
import { WaitForOptions, WaitForTypeEnum } from 'models'
import { useMemo } from 'react'

type WaitForNodeContentProps = {
  options: WaitForOptions
}

export default function WaitForNodeContent({
  options: { type, number },
}: WaitForNodeContentProps) {
  const measure = useMemo(() => {
    switch (type) {
      case WaitForTypeEnum.DAY:
        return 'dias'

      case WaitForTypeEnum.HOUR:
        return 'horas'
    }

    return 'minutos'
  }, [type])

  return (
    <Text color={number ? 'currentcolor' : 'gray.500'}>
      {number ? `Aguardar por ${number} ${measure}` : 'Aguardar'}
    </Text>
  )
}
