import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { sendRequest } from '@typebot.io/lib'
import { useCallback } from 'react'
import { TemplatesGetResponse } from '../types/TemplatesGetResponse'

type Data = TemplatesGetResponse | undefined
type UseGetTemplatesOptions = UseQueryOptions<Data>

export default function useGetTemplates(
  deviceId: string | undefined,
  options?: UseGetTemplatesOptions
) {
  const getTemplates = useCallback(
    async () =>
      (
        await sendRequest<TemplatesGetResponse>({
          url: `/api/whatsflow/templates/${deviceId}`,
          method: 'GET',
        })
      ).data,
    [deviceId]
  )

  const queryKey = ['whatsflow', 'templates', deviceId]

  const queryFn = useCallback(async () => getTemplates(), [getTemplates])

  return useQuery<Data>(queryKey, queryFn, options)
}
