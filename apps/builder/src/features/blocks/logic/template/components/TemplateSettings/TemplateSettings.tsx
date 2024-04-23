import useGetDevices from '@/whatsflow/api/template/queries/useGetDevices'
import useGetTemplates from '@/whatsflow/api/template/queries/useGetTemplates'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { Device, Template, TemplateOptions, Typebot } from '@typebot.io/schemas'
import { useCallback } from 'react'
import { TemplateSettingsInput } from './TemplateSettingsInput'

type Props = {
  options: TemplateOptions
  onOptionsChange: (options: TemplateOptions) => void
  typebot: Typebot
  blockId: string
}

export default function TemplateSettings({
  options,
  onOptionsChange,
  typebot,
  blockId,
}: Props) {
  const { data: devicesData, isFetching: isFetchingDevices } = useGetDevices()
  const { data: templatesData, isFetching: isFetchingTemplates } =
    useGetTemplates(options.device?.id, {
      enabled: Boolean(options.device?.id),
    })

  const handleDeviceChange = useCallback(
    (device: Device) =>
      onOptionsChange({
        device,
        template: null,
        placeholders: [],
      }),
    [onOptionsChange]
  )

  const handleTemplateChange = useCallback(
    (template: Template) =>
      onOptionsChange({
        ...options,
        template,
        placeholders: [],
      }),
    [onOptionsChange, options]
  )

  const data = [
    {
      type: 'image',
      placeholder: 'Imagem kkkk',
    },
    { type: 'video', placeholder: 'Videozinho' },
    { type: 'document', placeholder: 'Docs' },
    {
      placeholder: 'Variavel 2',
    },
    {
      placeholder: 'Variavel 3',
    },
  ]

  console.log({
    data,
    teste: options?.placeholders,
  })

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
          value={options.device?.id || undefined}
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

      {Boolean(options?.device) && (
        <FormControl>
          <FormLabel>Modelos:</FormLabel>

          <Select
            placeholder={
              (templatesData?.templates &&
                templatesData?.templates.length > 0) ||
              isFetchingTemplates
                ? 'Selecione o modelo'
                : 'Sem resultados'
            }
            icon={isFetchingTemplates ? <Spinner /> : undefined}
            value={options.template?.id}
            onChange={(event) => {
              const newTemplate = templatesData?.templates.find(
                ({ id }) => id === event.target.value
              )

              handleTemplateChange({
                category: newTemplate!.category,
                id: newTemplate!.id,
                language: newTemplate!.language,
                name: newTemplate!.name,
                status: newTemplate!.status,
              })
            }}
          >
            {templatesData?.templates?.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {Boolean(options?.template) &&
        data.map(({ placeholder, type }, index) => (
          <FormControl key={placeholder}>
            <FormLabel>{placeholder}</FormLabel>
            <TemplateSettingsInput
              index={index}
              options={options}
              onOptionsChange={onOptionsChange}
              placeholder={placeholder}
              typebot={typebot}
              blockId={blockId}
              type={type}
            />
          </FormControl>
        ))}
    </Stack>
  )
}
