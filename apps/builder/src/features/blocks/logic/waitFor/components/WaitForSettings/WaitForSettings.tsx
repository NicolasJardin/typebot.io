import { TextInput } from '@/components/inputs'
import { FormControl, FormLabel, Select, Stack } from '@chakra-ui/react'
import add from 'date-fns/add'
import set from 'date-fns/set'
import { WaitForOptions, WaitForTypeEnum } from 'models'
import { ChangeEvent, useCallback } from 'react'

type Props = {
  options: WaitForOptions
  onOptionsChange: (options: WaitForOptions) => void
}

export default function WaitForSettings({ options, onOptionsChange }: Props) {
  const getUntil = useCallback((options: WaitForOptions) => {
    let date = new Date()

    if (options.type === WaitForTypeEnum.DAY) {
      date = add(new Date(), {
        days: Number(options.number),
      })
    }

    if (options.type === WaitForTypeEnum.HOUR) {
      date = add(new Date(), {
        hours: Number(options.number),
      })
    }

    if (options.type === WaitForTypeEnum.MINUTE) {
      date = add(new Date(), {
        minutes: Number(options.number),
      })
    }

    const hours = options.time?.split(':')?.[0]
    const minutes = options.time?.split(':')?.[1]

    if (hours && minutes && options.type === WaitForTypeEnum.DAY) {
      date = set(date, {
        hours: Number(hours),
        minutes: Number(minutes),
        seconds: 0,
      })
    }

    return date.toString()
  }, [])

  const handleNumberChange = useCallback(
    (number: string | undefined) =>
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

  const getMeasures = useCallback((type: WaitForTypeEnum) => {
    switch (type) {
      case WaitForTypeEnum.DAY:
        return 'Dias'

      case WaitForTypeEnum.HOUR:
        return 'Horas'
    }

    return 'Minutos'
  }, [])

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Medida de tempo:</FormLabel>
        <Select value={options.type} onChange={handleTypeChange}>
          {Object.values(WaitForTypeEnum).map((type) => (
            <option key={type} value={type}>
              {getMeasures(type)}
            </option>
          ))}
        </Select>
      </FormControl>

      <TextInput
        label={`${getMeasures(options.type)} para aguardar`}
        defaultValue={options.number}
        onChange={handleNumberChange}
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
