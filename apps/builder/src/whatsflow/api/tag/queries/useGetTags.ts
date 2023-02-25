import { useToast } from '@/hooks/useToast'
import { Tag } from '@/whatsflow/api/tag/interfaces/domain/Tag'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useCallback } from 'react'
import { sendRequest } from 'utils'
import useTagFormatter from '../hooks/useTagFormatter'
import { TagGetResponse } from '../interfaces/TagGetResponse'

type Data = Tag[]
type UseGetTagsOptions = UseQueryOptions<Data>

export default function useGetTags(options?: UseGetTagsOptions) {
  const { showToast } = useToast()

  const { format } = useTagFormatter()

  const getTags = useCallback(
    async () =>
      (
        await sendRequest<TagGetResponse>({
          url: `/api/whatsflow/tags`,
          method: 'GET',
        })
      ).data,
    []
  )

  const queryKey = ['whatsflow', 'logic', 'tags']

  const queryFn = useCallback(
    async () => format(await getTags()),
    [getTags, format]
  )

  return useQuery<Data>(queryKey, queryFn, {
    ...options,
    onError: () => {
      showToast({ title: 'Não foi possivel buscar as tags' })

      options?.onError
    },
  })
}
