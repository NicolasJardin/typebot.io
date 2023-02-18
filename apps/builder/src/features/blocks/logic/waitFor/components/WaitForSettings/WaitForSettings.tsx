import { Input } from '@/components/inputs'
import { FormControl, FormLabel, Select, Stack } from '@chakra-ui/react'
import add from 'date-fns/add'
import set from 'date-fns/set'
import { WaitForOptions, WaitForTypeEnum } from 'models'
import { ChangeEvent, useCallback, useMemo } from 'react'

type Props = {
  options: WaitForOptions
  onOptionsChange: (options: WaitForOptions) => void
}

export default function WaitForSettings({ options, onOptionsChange }: Props) {
  const until = useMemo(() => {
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

    const hours = options.time?.split(':')?.[0]
    const minutes = options.time?.split(':')?.[1]

    if (hours && minutes && options.type === WaitForTypeEnum.DAY) {
      date = set(date, {
        hours: Number(hours),
        minutes: Number(minutes),
        seconds: 0,
      })
    }

    return date
  }, [options])

  const handleNumberChange = useCallback(
    (number: string | undefined) =>
      onOptionsChange({
        ...options,
        number,
        until,
      }),
    [onOptionsChange, options, until]
  )

  const handleTimeChange = useCallback(
    (time: string | undefined) =>
      onOptionsChange({
        ...options,
        time,
        until,
      }),
    [onOptionsChange, options, until]
  )

  const handleTypeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        type: e.target.value as WaitForTypeEnum,
        until,
      }),
    [onOptionsChange, options, until]
  )

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Medida de tempo:</FormLabel>
        <Select value={options.type} onChange={handleTypeChange}>
          {Object.values(WaitForTypeEnum).map((type) => (
            <option key={type} value={type}>
              {type === WaitForTypeEnum.DAY ? 'Dias' : 'Horas'}
            </option>
          ))}
        </Select>
      </FormControl>

      <Input
        label={`${
          options.type === WaitForTypeEnum.HOUR ? 'Horas' : 'Dias'
        } para aguardar`}
        defaultValue={options.number}
        onChange={handleNumberChange}
        placeholder="0"
      />

      {options.type === WaitForTypeEnum.DAY && (
        <Input
          label="Horário para enviar mensagem:"
          defaultValue={options.time}
          onChange={handleTimeChange}
          type="time"
        />
      )}
    </Stack>
  )
}
