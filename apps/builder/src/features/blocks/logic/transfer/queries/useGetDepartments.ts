import useTransferFormatter from '@/services/api/transfer/hooks/useTransferFormatter'
import { Department } from '@/services/api/transfer/interfaces/Department'
import useTransfer from '@/services/api/transfer/useTransfer'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

type Data = Department[]
type UseGetDepartmentsOptions = UseQueryOptions<Data>

export default function useGetDepartments(options?: UseGetDepartmentsOptions) {
  const { getDepartments } = useTransfer()

  const { formatDepartments } = useTransferFormatter()

  const queryKey = ['transfer', 'departments']

  const queryFn = useCallback(
    async () => formatDepartments(await getDepartments()),
    [getDepartments, formatDepartments]
  )

  return useQuery<Data>(queryKey, queryFn, options)
}
