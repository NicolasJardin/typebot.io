import { UploadButton } from '@/components/ImageUploadContent/UploadButton'
import { Input } from '@/components/inputs'
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import urlParser from 'js-video-url-parser/lib/base'
import 'js-video-url-parser/lib/provider/vimeo'
import 'js-video-url-parser/lib/provider/youtube'
import { VideoBubbleContent, VideoBubbleContentType } from 'models'
import { useCallback, useState } from 'react'
import { isDefined } from 'utils'

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
    const info = urlParser.parse(url)
    return isDefined(info) && info.provider && info.id
      ? onSubmit({
          type: info.provider as VideoBubbleContentType,
          url,
          id: info.id,
        })
      : onSubmit({ type: VideoBubbleContentType.URL, url })
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
          <Input
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
