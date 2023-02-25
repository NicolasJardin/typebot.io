import { useToast } from '@/hooks/useToast'
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
  const { showToast } = useToast()

  // const handleVariableChange = (taxg?: any) =>
  //   onOptionsChange({ ...options, id: tag?.id })

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Adicionar ou criar tag:</FormLabel>

        {/* <TagSearchInput
          onSelectTag={handleVariableChange}
          initialTagId={options?.id}
          id="variable-search"
        /> */}
      </FormControl>
    </Stack>
  )
}
