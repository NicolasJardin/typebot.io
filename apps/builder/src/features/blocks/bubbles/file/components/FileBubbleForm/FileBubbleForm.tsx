import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { AudioBubbleContent } from 'models'
import { Input } from '@/components/inputs'
import { useState } from 'react'
import { UploadButton } from '@/components/ImageUploadContent/UploadButton'

type FileBubbleFormProps = {
  fileUploadPath: string
  content: AudioBubbleContent
  onSubmit: (content: AudioBubbleContent) => void
}

export default function FileBubbleForm({
  content,
  fileUploadPath,
  onSubmit,
}: FileBubbleFormProps) {
  const [currentTab, setCurrentTab] = useState<'link' | 'upload'>('link')

  const submit = (url: string) => onSubmit({ url })

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
      <Stack p="2">
        {currentTab === 'upload' && (
          <Flex justify="center" py="2">
            <UploadButton
              fileType="file"
              filePath={fileUploadPath}
              onFileUploaded={submit}
              colorScheme="blue"
            >
              Escolha um arquivo
            </UploadButton>
          </Flex>
        )}
        {currentTab === 'link' && (
          <>
            <Input
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
