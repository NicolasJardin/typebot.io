import { Attendant } from '@/services/api/interfaces/Attendant'
import useTransfer from '@/services/api/transfer/useTransfer'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

type Data = Attendant[]
type UseGetAttendantsOptions = UseQueryOptions<Data>

export default function useGetAttendants(options?: UseGetAttendantsOptions) {
  const { getAttendants } = useTransfer()

  const queryKey = ['transfer', 'attendants']

  const queryFn = useCallback(() => getAttendants(), [getAttendants])

  return useQuery<Data>(queryKey, queryFn, options)
}
