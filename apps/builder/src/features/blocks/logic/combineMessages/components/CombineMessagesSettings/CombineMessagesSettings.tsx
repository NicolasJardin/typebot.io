import { TextInput } from '@/components/inputs'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { Stack, Text } from '@chakra-ui/react'
import { CombineMessagesOptions } from '@typebot.io/schemas'
import { useCallback } from 'react'

type CombineMessagesSettingsProps = {
  options: CombineMessagesOptions
  onOptionsChange: (options: CombineMessagesOptions) => void
}

export default function CombineMessagesSettings({
  options,
  onOptionsChange,
}: CombineMessagesSettingsProps) {
  const handleWaitSecondsChange = useCallback(
    (seconds: string) =>
      onOptionsChange({
        ...options,
        waitSeconds: Number(seconds),
      }),
    [onOptionsChange, options]
  )

  const handleTranscribeAudioChange = useCallback(
    (transcribeAudio: boolean) =>
      onOptionsChange({
        ...options,
        transcribeAudio,
      }),
    [onOptionsChange, options]
  )

  return (
    <Stack spacing={5}>
      <TextInput
        label="Tempo a aguardar em segundos"
        defaultValue={options?.waitSeconds.toString()}
        onChange={handleWaitSecondsChange}
        type="number"
        helperText={
          options.waitSeconds < 10 || options.waitSeconds > 900 ? (
            <Text color={'red.500'}>
              {options?.waitSeconds < 10
                ? 'O valor mínimo permitido é 10.'
                : 'O valor máximo permitido é 900.'}
            </Text>
          ) : null
        }
      />

      <SwitchWithLabel
        label="Transcrever áudio"
        initialValue={options.transcribeAudio}
        onCheckChange={handleTranscribeAudioChange}
      />
    </Stack>
  )
}
