import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { sendRequest } from '@typebot.io/lib'
import { useCallback } from 'react'
import { AssistantsGetResponse } from '../types/AssistantsGetResponse'

type Data = AssistantsGetResponse | undefined
type UseGetDecivesOptions = UseQueryOptions<Data>

export default function useGetAssistants(options?: UseGetDecivesOptions) {
  const getAssistants = useCallback(
    async () =>
      (
        await sendRequest<AssistantsGetResponse>({
          url: `/api/whatsflow/assistants`,
          method: 'GET',
        })
      ).data,
    []
  )

  const queryKey = ['whatsflow', 'assistants']

  const queryFn = useCallback(async () => getAssistants(), [getAssistants])

  return useQuery<Data>(queryKey, queryFn, options)
}
