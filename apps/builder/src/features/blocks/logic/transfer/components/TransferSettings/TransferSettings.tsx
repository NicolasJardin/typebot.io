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
  options: TransferOptions | undefined
  onOptionsChange: (options: TransferOptions) => void
}

export default function TransferSettings({
  options,
  onOptionsChange,
}: TransferSettingsProps) {
  const { showToast } = useToast()

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | undefined
  >(options?.departmentId)

  const [selectedAttendantId, setSelectedAttendantId] = useState<
    string | undefined
  >(options?.attendantId)

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

  const handleDepartmentChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        departmentId: e.target.value,
        attendantId: '',
      }),
    [onOptionsChange, options]
  )

  const handleAttendantChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) =>
      onOptionsChange({
        ...options,
        attendantId: e.target.value,
        departmentId: '',
      }),
    [onOptionsChange, options]
  )

  const handleMessageChange = (message: string | undefined) => {
    onOptionsChange({ ...options, message })
  }

  useEffect(() => {
    setSelectedDepartmentId(options?.departmentId)
  }, [options?.departmentId])

  useEffect(() => {
    setSelectedAttendantId(options?.attendantId)
  }, [options?.attendantId])

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Setor:</FormLabel>
        <Select
          placeholder="Selecione um setor"
          value={selectedDepartmentId}
          onChange={handleDepartmentChange}
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
          value={selectedAttendantId}
          onChange={handleAttendantChange}
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
