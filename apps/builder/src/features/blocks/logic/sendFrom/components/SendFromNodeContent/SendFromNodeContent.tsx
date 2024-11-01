import { Text } from '@chakra-ui/react'
import { SendFromOptions } from '@typebot.io/schemas'

type SendFromNodeContentProps = { options: SendFromOptions }

export default function SendFromNodeContent({
  options,
}: SendFromNodeContentProps) {
  return (
    <Text>
      Enviar de{' '}
      {options?.device?.name
        ? `dispositivo ${options?.device.name} para contato ${
            options?.contact || '-'
          }`
        : ''}
    </Text>
  )
}
