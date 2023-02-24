import { Input } from '@/components/inputs'
import { Stack } from '@chakra-ui/react'
import { ButtonOptions } from 'models'
import { useCallback } from 'react'

type ButtonSettingsProps = {
  options: ButtonOptions
  onOptionsChange: (options: ButtonOptions) => void
}

export default function ButtonSettings({
  options,
  onOptionsChange,
}: ButtonSettingsProps) {
  const handleTitleChange = useCallback(
    (title: string) =>
      onOptionsChange({
        ...options,
        title,
      }),
    [onOptionsChange, options]
  )

  const handleUrlChange = useCallback(
    (url: string) =>
      onOptionsChange({
        ...options,
        url,
      }),
    [onOptionsChange, options]
  )

  return (
    <Stack spacing={4}>
      <Input
        label="Texto do Botão"
        defaultValue={options.title}
        onChange={handleTitleChange}
        placeholder="Ex: Clique para acessar"
      />

      <Input
        label="Link do Botão"
        defaultValue={options.url}
        onChange={handleUrlChange}
        placeholder="http://"
      />
    </Stack>
  )
}
