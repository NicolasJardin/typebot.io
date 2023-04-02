import { TextInput } from '@/components/inputs'
import { useToast } from '@/hooks/useToast'
import useGetAttendants from '@/whatsflow/api/transfer/queries/useGetAttendants'
import { Fade, FormControl, FormLabel, Stack, Text } from '@chakra-ui/react'
import { SpreadOptions } from '@typebot.io/schemas'
import { useCallback, useEffect, useMemo } from 'react'
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
  const { attendant, attendants } = options

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
        attendants: newAttendants.map(({ value, label }) => ({
          id: value,
          name: label,
        })),
      }),
    [onOptionsChange, options]
  )

  const handleAttendantChange = useCallback(
    (attendant: SpreadOptions['attendant']) => {
      onOptionsChange({ ...options, attendant })
    },
    [options, onOptionsChange]
  )
  const { showToast } = useToast()

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

  useEffect(() => {
    if (!attendant?.id && attendants?.[0]) handleAttendantChange(attendants[0])

    if (attendant?.id !== attendants?.[0]?.id)
      handleAttendantChange(attendants[0] || {})
  }, [attendant, attendants, handleAttendantChange])

  return (
    <Stack spacing={4}>
      <Fade in={!!attendant.name} unmountOnExit>
        <Text fontWeight={'bold'}>Próximo atendente: {attendant.name}</Text>
      </Fade>

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
