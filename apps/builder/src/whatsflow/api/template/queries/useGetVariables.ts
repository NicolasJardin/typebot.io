import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { sendRequest } from '@typebot.io/lib'
import { useCallback } from 'react'
import { VariablesGetResponse } from '../types/VariablesGetResponse'

type Data = VariablesGetResponse | undefined
type UseGetVariablesOptions = UseQueryOptions<Data>

export default function useGetVariables(
  deviceId: string | undefined,
  templateId: string | undefined,
  options?: UseGetVariablesOptions
) {
  const getVariables = useCallback(
    async () =>
      (
        await sendRequest<VariablesGetResponse>({
          url: `/api/whatsflow/variables/${deviceId},${templateId}`,
          method: 'GET',
        })
      ).data,
    [templateId, deviceId]
  )

  const queryKey = ['whatsflow', 'variables', templateId]

  const queryFn = useCallback(async () => getVariables(), [getVariables])

  return useQuery<Data>(queryKey, queryFn, options)
}
