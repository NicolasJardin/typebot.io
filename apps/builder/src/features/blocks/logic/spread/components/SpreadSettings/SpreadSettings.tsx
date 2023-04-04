import { TextInput } from '@/components/inputs'
import { useToast } from '@/hooks/useToast'
import useGetAttendants from '@/whatsflow/api/transfer/queries/useGetAttendants'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import { SpreadOptions } from '@typebot.io/schemas'
import { useCallback, useMemo } from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

type SpreadSettingsProps = {
  options: SpreadOptions
  onOptionsChange: (options: SpreadOptions) => void
}

export default function SpreadSettings({
  options,
  onOptionsChange,
}: SpreadSettingsProps) {
  const { attendants } = options

  const { showToast } = useToast()

  const handleMessage = useCallback(
    (message: string) =>
      onOptionsChange({
        ...options,
        message,
      }),
    [onOptionsChange, options]
  )

  const handleAttendants = useCallback(
    (newAttendants: { value: string; label: string }[]) =>
      onOptionsChange({
        ...options,
        attendant: {
          id: newAttendants?.[0]?.value,
          name: newAttendants?.[0]?.label,
        },
        attendants: newAttendants.map(({ value, label }) => ({
          id: value,
          name: label,
        })),
      }),
    [onOptionsChange, options]
  )

  const { data: attendantsData, isFetching: isFetchingAttendants } =
    useGetAttendants({
      onError: () => {
        showToast({
          title: 'Não foi possível buscar os atendentes',
        })
      },
    })

  const selectOptions = useMemo(
    () =>
      attendantsData?.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    [attendantsData]
  )

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Atendentes:</FormLabel>

        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isLoading={isFetchingAttendants}
          value={attendants.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          isClearable={false}
          onChange={(newValue) => handleAttendants(newValue)}
          isMulti
          options={selectOptions}
        />
      </FormControl>

      <TextInput
        label="Mensagem de Transferência:"
        defaultValue={options?.message || ''}
        onChange={handleMessage}
        placeholder="Digite sua mensagem"
      />
    </Stack>
  )
}
