import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { sendRequest } from '@typebot.io/lib'
import { useCallback } from 'react'
import { DevicesGetResponse } from '../types/DevicesGetResponse'

type Data = DevicesGetResponse | undefined
type UseGetDecivesOptions = UseQueryOptions<Data>

export default function useGetDevices(options?: UseGetDecivesOptions) {
  const getDevices = useCallback(
    async () =>
      (
        await sendRequest<DevicesGetResponse>({
          url: `/api/whatsflow/devices`,
          method: 'GET',
        })
      ).data,
    []
  )

  const queryKey = ['whatsflow', 'devices']

  const queryFn = useCallback(async () => await getDevices(), [getDevices])

  return useQuery<Data>(queryKey, queryFn, options)
}
