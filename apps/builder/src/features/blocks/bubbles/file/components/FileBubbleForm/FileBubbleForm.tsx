import { UploadButton } from '@/components/ImageUploadContent/UploadButton'
import { TextInput } from '@/components/inputs'
import { Button, HStack, Stack, Text } from '@chakra-ui/react'
import { AudioBubbleContent } from '@typebot.io/schemas'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type FileBubbleFormProps = {
  fileUploadPath: string
  content: AudioBubbleContent
  onSubmit: (content: AudioBubbleContent) => void
  fileType?: 'audio' | 'video' | 'image' | 'file' | 'document'
  disableEmbedLink?: boolean
}

export default function FileBubbleForm({
  content,
  fileUploadPath,
  fileType,
  onSubmit,
  disableEmbedLink = false,
}: FileBubbleFormProps) {
  const [currentTab, setCurrentTab] = useState<'link' | 'upload'>(
    disableEmbedLink ? 'upload' : 'link'
  )

  const submit = (url: string) => onSubmit({ url })

  const contentUploaded = useMemo(() => {
    if (!content.url) return null

    switch (fileType) {
      case 'image':
        return (
          <Image
            src={content.url}
            alt=""
            width={250}
            height={250}
            style={{ borderRadius: '6px' }}
          />
        )
      case 'video':
        return (
          <iframe
            src={content.url}
            style={{
              width: '100%',
              height: 250,
              borderRadius: '6px',
            }}
            allowFullScreen
          />
        )
    }

    return <Text>{content?.url}</Text>
  }, [content.url, fileType])

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
        {!disableEmbedLink && (
          <Button
            variant={currentTab === 'link' ? 'solid' : 'ghost'}
            onClick={() => setCurrentTab('link')}
            size="sm"
          >
            Incorporar link
          </Button>
        )}
      </HStack>
      <Stack p="2">
        {currentTab === 'upload' && (
          <Stack justify="center" py="2" spacing={8}>
            {contentUploaded}

            <UploadButton
              fileType={fileType || 'file'}
              filePath={fileUploadPath}
              onFileUploaded={submit}
              colorScheme="blue"
            >
              Escolha um arquivo
            </UploadButton>
          </Stack>
        )}
        {currentTab === 'link' && (
          <>
            <TextInput
              placeholder="Cole o link do arquivo..."
              defaultValue={content.url ?? ''}
              onChange={submit}
            />
            <Text fontSize="sm" color="gray.400" textAlign="center">
              Funciona com PDF, CSV, TXT e etc...
            </Text>
          </>
        )}
      </Stack>
    </Stack>
  )
}
