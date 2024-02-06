import { ImageUploadContent } from '@/components/ImageUploadContent'
import { Stack } from '@chakra-ui/react'
import { ImageBubbleBlock } from '@typebot.io/schemas'

type Props = {
  typebotId: string
  block: ImageBubbleBlock
  onContentChange: (content: ImageBubbleBlock['content']) => void
}

export const ImageBubbleSettings = ({
  typebotId,
  block,
  onContentChange,
}: Props) => {
  const updateImage = (url: string) => {
    onContentChange({ ...block.content, url })
  }

  return (
    <Stack p="2" spacing={4}>
      <ImageUploadContent
        filePath={`typebots/${typebotId}/blocks/${block.id}`}
        defaultUrl={block.content?.url}
        onSubmit={updateImage}
      />
    </Stack>
  )
}
