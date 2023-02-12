import { Department } from '@/services/api/interfaces/Department'
import useTransfer from '@/services/api/transfer/useTransfer'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

type Data = Department[]
type UseGetDepartmentsOptions = UseQueryOptions<Data>

export default function useGetDepartments(options?: UseGetDepartmentsOptions) {
  const { getDepartments } = useTransfer()

  const queryKey = ['transfer', 'departments']

  const queryFn = useCallback(() => getDepartments(), [getDepartments])

  return useQuery<Data>(queryKey, queryFn, options)
}
