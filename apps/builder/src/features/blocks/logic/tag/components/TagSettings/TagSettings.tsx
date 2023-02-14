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

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Adicionar ou criar tag:</FormLabel>
      </FormControl>
    </Stack>
  )
}
