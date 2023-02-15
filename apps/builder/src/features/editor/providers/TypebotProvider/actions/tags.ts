import { produce } from 'immer'
import { WritableDraft } from 'immer/dist/types/types-external'
import { Tag, Typebot } from 'models'
import { SetTypebot } from '../TypebotProvider'

export type TagsActions = {
  createTag: (tag: Tag) => void
  updateTag: (tagId: string, updates: Partial<Omit<Tag, 'id'>>) => void
  deleteTag: (tagId: string) => void
}

export const tagsActions = (setTypebot: SetTypebot): TagsActions => ({
  createTag: (newTag: Tag) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        typebot.tags.push(newTag)
      })
    ),
  updateTag: (tagId: string, updates: Partial<Omit<Tag, 'id'>>) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        typebot.tags = typebot.tags.map((v) =>
          v.id === tagId ? { ...v, ...updates } : v
        )
      })
    ),
  deleteTag: (itemId: string) =>
    setTypebot((typebot) =>
      produce(typebot, (typebot) => {
        deleteTagDraft(typebot, itemId)
      })
    ),
})

export const deleteTagDraft = (
  typebot: WritableDraft<Typebot>,
  tagId: string
) => {
  const index = typebot.tags.findIndex((v) => v.id === tagId)
  typebot.tags.splice(index, 1)
}
