import { Text } from '@chakra-ui/react'
import { TemplateOptions } from '@typebot.io/schemas'
import { useMemo } from 'react'

type TemplateNodeContentProps = {
  options: TemplateOptions
}

export default function TemplateNodeContent({
  options: { device, template },
}: TemplateNodeContentProps) {
  const hasValues = useMemo(
    () => Boolean(device) && Boolean(template),
    [device, template]
  )

  return (
    <Text color={hasValues ? 'currentcolor' : 'gray.500'}>
      {hasValues
        ? `Dispositivo ${device?.name} | Template ${template?.name}`
        : 'Selecione um template'}
    </Text>
  )
}
