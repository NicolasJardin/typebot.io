import { TagSearchInput } from '@/components/TagSearchInput'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import { TagOptions } from 'models'

type TagSettingsProps = {
  options: TagOptions | undefined
  onOptionsChange: (options: TagOptions) => void
}

export default function TagSettings({
  options,
  onOptionsChange,
}: TagSettingsProps) {
  const handleTagChange = (tag: TagOptions) =>
    onOptionsChange({
      color: tag.color || options?.color,
      name: tag.name || options?.name,
    })

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Adicionar ou criar tag:</FormLabel>

        <TagSearchInput
          onSelectTag={handleTagChange}
          defaultTagName={options?.name}
          id="tag-search"
        />
      </FormControl>
    </Stack>
  )
}
