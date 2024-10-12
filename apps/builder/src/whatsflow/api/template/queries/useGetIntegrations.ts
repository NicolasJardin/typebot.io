import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { sendRequest } from '@typebot.io/lib'
import { useCallback } from 'react'
import { DevicesGetResponse } from '../types/DevicesGetResponse'

type Data = DevicesGetResponse | undefined
type UseGetDecivesOptions = UseQueryOptions<Data>

export default function useGetIntegrations(options?: UseGetDecivesOptions) {
  const getIntegrations = useCallback(
    async () =>
      (
        await sendRequest<DevicesGetResponse>({
          url: `/api/whatsflow/integrations`,
          method: 'GET',
        })
      ).data,
    []
  )

  const queryKey = ['whatsflow', 'integrations']

  const queryFn = useCallback(async () => getIntegrations(), [getIntegrations])

  return useQuery<Data>(queryKey, queryFn, options)
}
