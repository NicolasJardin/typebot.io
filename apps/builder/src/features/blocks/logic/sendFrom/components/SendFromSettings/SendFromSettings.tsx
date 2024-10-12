import { TextInput, Textarea } from '@/components/inputs'
import useGetIntegrations from '@/whatsflow/api/template/queries/useGetIntegrations'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { Device, SendFromOptions } from '@typebot.io/schemas'
import { useCallback } from 'react'

type SendFromSettingsProps = {
  options: SendFromOptions | undefined
  onOptionsChange: (options: SendFromOptions) => void
}

export default function SendFromSettings({
  options,
  onOptionsChange,
}: SendFromSettingsProps) {
  const { data: devicesData, isFetching: isFetchingDevices } =
    useGetIntegrations()

  const handleDeviceChange = useCallback(
    (device: Device) =>
      onOptionsChange({
        device,
        contact: options?.contact || '',
        content: options?.content || '',
      }),
    [onOptionsChange, options]
  )

  const handleContactChange = useCallback(
    (newValue: string) =>
      onOptionsChange({
        device: options?.device || null,
        contact: newValue,
        content: options?.content || '',
      }),
    [onOptionsChange, options]
  )

  const handleContentChange = useCallback(
    (newValue: string) =>
      onOptionsChange({
        device: options?.device || null,
        contact: options?.contact || '',
        content: newValue,
      }),
    [onOptionsChange, options]
  )

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Dispositivo:</FormLabel>

        <Select
          placeholder={
            (devicesData?.devices && devicesData?.devices.length > 0) ||
            isFetchingDevices
              ? 'Selecione um dispositivo'
              : 'Sem resultados'
          }
          icon={isFetchingDevices ? <Spinner /> : undefined}
          value={options?.device?.id || undefined}
          onChange={(event) => {
            const newDevice = devicesData?.devices.find(
              ({ id }) => id === event.target.value
            )

            handleDeviceChange({
              chatId: newDevice!.chatId,
              id: newDevice!.id,
              name: newDevice!.name,
            })
          }}
        >
          {devicesData?.devices.map((device) => (
            <option key={device.id} value={device.id}>{`${
              device.name
            } | ${device.chatId.replace('@c.us', '')}`}</option>
          ))}
        </Select>
      </FormControl>

      {!!options?.device && (
        <>
          <TextInput
            defaultValue={options?.contact}
            onChange={handleContactChange}
            label="Contato:"
          />

          <Textarea
            label="Mensagem:"
            defaultValue={options?.content}
            onChange={handleContentChange}
          />
        </>
      )}
    </Stack>
  )
}
