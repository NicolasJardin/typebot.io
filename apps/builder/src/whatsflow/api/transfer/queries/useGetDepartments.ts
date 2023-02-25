import useTransferFormatter from '@/whatsflow/api/transfer/hooks/useTransferFormatter'
import { Department } from '@/whatsflow/api/transfer/interfaces/Department'
import { DepartmentGetResponse } from '@/whatsflow/api/transfer/interfaces/DepartmentGetResponse'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'
import { sendRequest } from 'utils'

type Data = Department[]
type UseGetDepartmentsOptions = UseQueryOptions<Data>

export default function useGetDepartments(options?: UseGetDepartmentsOptions) {
  const getDepartments = useCallback(
    async () =>
      (
        await sendRequest<DepartmentGetResponse>({
          url: `/api/whatsflow/sectors`,
          method: 'GET',
        })
      ).data,
    []
  )

  const { formatDepartments } = useTransferFormatter()

  const queryKey = ['transfer', 'departments']

  const queryFn = useCallback(
    async () => formatDepartments(await getDepartments()),
    [getDepartments, formatDepartments]
  )

  return useQuery<Data>(queryKey, queryFn, options)
}
