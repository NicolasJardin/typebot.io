import { TextInput } from '@/components/inputs'
import { TimeMeasurementSelect, useTime } from '@/modules/time'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import {
  WaitForOptions,
  WaitForTypeEnum,
  WaitForTypeEnumLabel,
} from '@typebot.io/schemas'
import { ChangeEvent, useCallback } from 'react'

type Props = {
  options: WaitForOptions
  onOptionsChange: (options: WaitForOptions) => void
}

export default function WaitForSettings({ options, onOptionsChange }: Props) {
  const { getUntil } = useTime()

  const handleNumberChange = useCallback(
    (number: number | undefined) =>
      onOptionsChange({
        ...options,
        number,
        until: getUntil({ ...options, number }),
      }),
    [onOptionsChange, options, getUntil]
  )

  const handleTimeChange = useCallback(
    (time: string | undefined) =>
      onOptionsChange({
        ...options,
        time,
        until: getUntil({ ...options, time }),
      }),
    [onOptionsChange, options, getUntil]
  )

  const handleTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        type: e.target.value as WaitForTypeEnum,
        until: getUntil({
          ...options,
          type: e.target.value as WaitForTypeEnum,
        }),
      }),
    [onOptionsChange, options, getUntil]
  )

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Medida de tempo:</FormLabel>
        <TimeMeasurementSelect
          value={options.type}
          onChange={handleTypeChange}
        />
      </FormControl>

      <TextInput
        label={`${WaitForTypeEnumLabel[options.type]} para aguardar`}
        defaultValue={options.number?.toString()}
        onChange={(value) => handleNumberChange(Number(value))}
        placeholder="0"
      />

      {options.type === WaitForTypeEnum.DAY && (
        <TextInput
          label="Horário para enviar mensagem:"
          defaultValue={options.time}
          onChange={handleTimeChange}
          type="time"
        />
      )}
    </Stack>
  )
}
