import { TextInput } from '@/components/inputs'
import { useToast } from '@/hooks/useToast'
import useGetAttendants from '@/whatsflow/api/transfer/queries/useGetAttendants'
import useGetDepartments from '@/whatsflow/api/transfer/queries/useGetDepartments'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { TransferGroupEnum, TransferOptions } from '@typebot.io/schemas'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

type TransferSettingsProps = {
  options: TransferOptions
  onOptionsChange: (options: TransferOptions) => void
}

export default function TransferSettings({
  options,
  onOptionsChange,
}: TransferSettingsProps) {
  const { showToast } = useToast()

  const [selectedDepartmentIdOrGroupType, setSelectedDepartmentIdOrGroupType] =
    useState<string | undefined>(options.department?.id || options.group?.type)

  const [selectedAttendant, setSelectedAttendant] = useState<
    TransferOptions['attendant'] | undefined
  >(options?.attendant)

  const { data: departments, isFetching: isFetchingDepartments } =
    useGetDepartments({
      onError: () => {
        showToast({
          title: 'Não foi possível buscar os setores',
        })
      },
    })

  const { data: attendants, isFetching: isFetchingAttendants } =
    useGetAttendants({
      onError: () => {
        showToast({
          title: 'Não foi possível buscar os atendentes',
        })
      },
    })

  const handleDepartmentOrGroupChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === 'FINISHED')
        return onOptionsChange({
          ...options,
          group: {
            type: TransferGroupEnum.FINISHED,
          },
          department: {
            id: '',
          },
          attendant: {
            id: '',
          },
        })

      onOptionsChange({
        ...options,
        department: {
          ...options?.department,
          id: e.target.value,
        },
        attendant: {
          id: '',
        },
        group: {},
      })
    },
    [onOptionsChange, options]
  )

  const handleDepartmentNameChange = useCallback(
    (name: string) =>
      onOptionsChange({
        ...options,
        department: {
          ...options?.department,
          name,
        },
      }),
    [onOptionsChange, options]
  )

  const handleAttendantIdChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        attendant: {
          ...options?.attendant,
          id: e.target.value,
        },
        department: {
          id: '',
        },
        group: {},
      }),
    [onOptionsChange, options]
  )

  const handleAttendantNameChange = useCallback(
    (name: string) =>
      onOptionsChange({
        ...options,
        attendant: {
          ...options?.attendant,
          name,
        },
      }),
    [onOptionsChange, options]
  )

  const handleMessageChange = (message: string | undefined) => {
    onOptionsChange({ ...options, message })
  }

  useEffect(() => {
    setSelectedDepartmentIdOrGroupType(
      options?.department?.id || options?.group?.type
    )

    const departmentName = departments?.find(
      ({ id }) => id === options.department?.id
    )?.name

    if (departmentName) handleDepartmentNameChange(departmentName)
  }, [
    options?.department,
    departments,
    handleDepartmentNameChange,
    options?.group?.type,
  ])

  useEffect(() => {
    setSelectedAttendant(options?.attendant)

    const attendantName = attendants?.find(
      ({ id }) => id === options.attendant?.id
    )?.name

    if (attendantName) handleAttendantNameChange(attendantName)
  }, [options?.attendant, attendants, handleAttendantNameChange])

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Setor:</FormLabel>
        <Select
          placeholder="Selecione um setor"
          value={selectedDepartmentIdOrGroupType}
          onChange={handleDepartmentOrGroupChange}
          icon={isFetchingDepartments ? <Spinner speed="0.7s" /> : undefined}
        >
          {departments?.map((department) => (
            <option key={department.id} value={department.id}>
              {department?.name}
            </option>
          ))}
          <option value="FINISHED">Transferir para finalizados</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Atendente:</FormLabel>
        <Select
          placeholder="Selecione um atendente"
          value={selectedAttendant?.id}
          onChange={handleAttendantIdChange}
          icon={isFetchingAttendants ? <Spinner speed="0.7s" /> : undefined}
        >
          {attendants?.map((attendant) => (
            <option key={attendant?.id} value={attendant?.id}>
              {attendant?.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <TextInput
        label="Mensagem de Transferência:"
        defaultValue={options?.message || ''}
        onChange={handleMessageChange}
        placeholder="Digite sua mensagem"
      />
    </Stack>
  )
}
