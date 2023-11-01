import { UploadButton } from '@/components/ImageUploadContent/UploadButton'
import { TextInput } from '@/components/inputs'
import { FilePathUploadProps } from '@/features/upload/api/generateUploadUrl'
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { AudioBubbleContent } from '@typebot.io/schemas'
import { useState } from 'react'

type FileBubbleFormProps = {
  content: AudioBubbleContent
  onSubmit: (content: AudioBubbleContent) => void
  uploadFileProps: FilePathUploadProps
}

export default function FileBubbleForm({
  content,
  uploadFileProps,
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
              filePathProps={uploadFileProps}
              onFileUploaded={submit}
              colorScheme="blue"
            >
              Escolha um arquivo
            </UploadButton>
          </Flex>
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
