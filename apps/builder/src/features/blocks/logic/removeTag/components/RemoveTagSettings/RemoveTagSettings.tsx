import { TagSearchInput } from '@/components/TagSearchInput'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import { RemoveTagOptions } from '@typebot.io/schemas'

type RemoveTagSettingsProps = {
  options: RemoveTagOptions | undefined
  onOptionsChange: (options: RemoveTagOptions) => void
}

export default function RemoveTagSettings({
  options,
  onOptionsChange,
}: RemoveTagSettingsProps) {
  const handleTagChange = (tag: RemoveTagOptions) =>
    onOptionsChange({
      color: tag.color || options?.color,
      name: tag.name || options?.name,
    })

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Remover tag:</FormLabel>

        <TagSearchInput
          onSelectTag={handleTagChange}
          defaultTagName={options?.name}
          id="tag-search"
        />
      </FormControl>
    </Stack>
  )
}
