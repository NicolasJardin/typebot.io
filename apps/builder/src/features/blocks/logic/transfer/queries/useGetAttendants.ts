import useTransferFormatter from '@/services/api/transfer/hooks/useTransferFormatter'
import { Attendant } from '@/services/api/transfer/interfaces/Attendant'
import useTransfer from '@/services/api/transfer/useTransfer'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

type Data = Attendant[]
type UseGetAttendantsOptions = UseQueryOptions<Data>

export default function useGetAttendants(options?: UseGetAttendantsOptions) {
  const { getAttendants } = useTransfer()

  const { formatAttendants } = useTransferFormatter()

  const queryKey = ['transfer', 'attendants']

  const queryFn = useCallback(
    async () => formatAttendants(await getAttendants()),
    [getAttendants, formatAttendants]
  )

  return useQuery<Data>(queryKey, queryFn, options)
}
