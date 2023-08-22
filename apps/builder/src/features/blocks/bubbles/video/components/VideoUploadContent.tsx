import { UploadButton } from '@/components/ImageUploadContent/UploadButton'
import { TextInput } from '@/components/inputs'
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { VideoBubbleContent, VideoBubbleContentType } from '@typebot.io/schemas'
import 'js-video-url-parser/lib/provider/vimeo'
import 'js-video-url-parser/lib/provider/youtube'
import { useCallback, useState } from 'react'

const vimeoRegex = /vimeo\.com\/(\d+)/
const youtubeRegex = /youtube\.com\/(watch\?v=|shorts\/)(\w+)|youtu\.be\/(\w+)/

type Props = {
  fileUploadPath: string
  content?: VideoBubbleContent
  onSubmit: (content: VideoBubbleContent) => void
}

export const VideoUploadContent = ({
  content,
  onSubmit,
  fileUploadPath,
}: Props) => {
  const [currentTab, setCurrentTab] = useState<'link' | 'upload'>('link')

  const submit = useCallback(
    (url: string) => onSubmit({ url, type: VideoBubbleContentType.URL }),
    [onSubmit]
  )

  const handleUrlChange = (url: string) => {
    const info = parseVideoUrl(url)
    return onSubmit({
      type: info.type,
      url,
      id: info.id,
    })
  }
  return (
    <Stack>
      <HStack>
        <Button
          variant={currentTab === 'upload' ? 'solid' : 'ghost'}
          onClick={() => setCurrentTab('upload')}
          size="sm"
        >
          Carregar
        </Button>
        <Button
          variant={currentTab === 'link' ? 'solid' : 'ghost'}
          onClick={() => setCurrentTab('link')}
          size="sm"
        >
          Incorporar link
        </Button>
      </HStack>
      {currentTab === 'link' ? (
        <Stack p="2">
          <TextInput
            placeholder="Cole o link do vídeo..."
            defaultValue={content?.url ?? ''}
            onChange={handleUrlChange}
          />
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Funciona com Youtube, Vimeo e outros
          </Text>
        </Stack>
      ) : (
        <Flex justify="center" py="2">
          <UploadButton
            fileType="video"
            filePath={fileUploadPath}
            onFileUploaded={submit}
            colorScheme="blue"
          >
            Escolha um arquivo
          </UploadButton>
        </Flex>
      )}
    </Stack>
  )
}

const parseVideoUrl = (
  url: string
): { type: VideoBubbleContentType; url: string; id?: string } => {
  if (vimeoRegex.test(url)) {
    const id = url.match(vimeoRegex)?.at(1)
    if (!id) return { type: VideoBubbleContentType.URL, url }
    return { type: VideoBubbleContentType.VIMEO, url, id }
  }
  if (youtubeRegex.test(url)) {
    const id = url.match(youtubeRegex)?.at(2) ?? url.match(youtubeRegex)?.at(3)
    if (!id) return { type: VideoBubbleContentType.URL, url }
    return { type: VideoBubbleContentType.YOUTUBE, url, id }
  }
  return { type: VideoBubbleContentType.URL, url }
}
