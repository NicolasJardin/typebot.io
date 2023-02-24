import useTransferFormatter from '@/services/api/transfer/hooks/useTransferFormatter'
import { Attendant } from '@/services/api/transfer/interfaces/Attendant'
import { AttendantGetResponse } from '@/services/api/transfer/interfaces/AttendantGetResponse'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'
import { sendRequest } from 'utils'

type Data = Attendant[]
type UseGetAttendantsOptions = UseQueryOptions<Data>

export default function useGetAttendants(options?: UseGetAttendantsOptions) {
  const getAttendants = useCallback(
    async () =>
      (
        await sendRequest<AttendantGetResponse>({
          url: `/api/whatsflow/attendants`,
          method: 'GET',
        })
      ).data,
    []
  )

  const { formatAttendants } = useTransferFormatter()

  const queryKey = ['transfer', 'attendants']

  const queryFn = useCallback(
    async () => formatAttendants(await getAttendants()),
    [getAttendants, formatAttendants]
  )

  return useQuery<Data>(queryKey, queryFn, options)
}
