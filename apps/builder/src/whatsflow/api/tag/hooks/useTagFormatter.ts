import { useCallback } from 'react'
import { TagGetResponse } from '../interfaces/TagGetResponse'
import { Tag } from '../interfaces/domain/Tag'

export default function useTagFormatter() {
  const format = useCallback<(response: TagGetResponse | undefined) => Tag[]>(
    (response) =>
      response?.tags.map((data) => ({
        id: data.uuid,
        name: data.title,
        color: data.color,
      })) || [],
    []
  )

  return {
    format,
  }
}
