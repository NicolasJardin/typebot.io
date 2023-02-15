import { TagSearchInput } from '@/components/TagSearchInput'
import { useToast } from '@/hooks/useToast'
import { FormControl, FormLabel, Stack } from '@chakra-ui/react'
import { Tag, TagOptions } from 'models'

type TagSettingsProps = {
  options: TagOptions | undefined
  onOptionsChange: (options: TagOptions) => void
}

export default function TagSettings({
  options,
  onOptionsChange,
}: TagSettingsProps) {
  const { showToast } = useToast()

  const handleVariableChange = (tag?: Tag) =>
    onOptionsChange({ ...options, id: tag?.id })

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Adicionar ou criar tag:</FormLabel>

        <TagSearchInput
          onSelectTag={handleVariableChange}
          initialTagId={options?.id}
          id="variable-search"
        />
      </FormControl>
    </Stack>
  )
}
