import { Input } from '@/components/inputs'
import { useToast } from '@/hooks/useToast'
import {
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { TransferOptions } from 'models'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import useGetAttendants from '../../queries/useGetAttendants'
import useGetDepartments from '../../queries/useGetDepartments'

type TransferSettingsProps = {
  options: TransferOptions
  onOptionsChange: (options: TransferOptions) => void
}

export default function TransferSettings({
  options,
  onOptionsChange,
}: TransferSettingsProps) {
  const { showToast } = useToast()

  const [selectedDepartment, setSelectedDepartment] = useState<
    TransferOptions['department'] | undefined
  >(options.department)

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

  const handleDepartmentIdChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        department: {
          ...options?.department,
          id: e.target.value,
        },
        attendant: {
          id: '',
        },
      }),
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
    setSelectedDepartment(options?.department)

    const departmentName = departments?.find(
      ({ id }) => id === options.department.id
    )?.name

    if (departmentName) handleDepartmentNameChange(departmentName)
  }, [options?.department, departments, handleDepartmentNameChange])

  useEffect(() => {
    setSelectedAttendant(options?.attendant)

    const attendantName = attendants?.find(
      ({ id }) => id === options.attendant.id
    )?.name

    if (attendantName) handleAttendantNameChange(attendantName)
  }, [options?.attendant, attendants, handleAttendantNameChange])

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Setor:</FormLabel>
        <Select
          placeholder="Selecione um setor"
          value={selectedDepartment?.id}
          onChange={handleDepartmentIdChange}
          icon={isFetchingDepartments ? <Spinner speed="0.7s" /> : undefined}
        >
          {departments?.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
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
            <option key={attendant.id} value={attendant.id}>
              {attendant.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <Input
        label="Mensagem de Transferência:"
        defaultValue={options?.message || ''}
        onChange={handleMessageChange}
        placeholder="Digite sua mensagem"
      />
    </Stack>
  )
}
