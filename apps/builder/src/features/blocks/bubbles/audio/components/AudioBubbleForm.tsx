import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { AudioBubbleContent } from '@typebot.io/schemas'
import { TextInput } from '@/components/inputs'
import { useState } from 'react'
import { UploadButton } from '@/components/ImageUploadContent/UploadButton'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'

type Props = {
  fileUploadPath: string
  content: AudioBubbleContent
  onContentChange: (content: AudioBubbleContent) => void
}

export const AudioBubbleForm = ({
  fileUploadPath,
  content,
  onContentChange,
}: Props) => {
  const [currentTab, setCurrentTab] = useState<'link' | 'upload'>('link')

  const updateUrl = (url: string) => onContentChange({ ...content, url })

  const updateAutoPlay = (isAutoplayEnabled: boolean) =>
    onContentChange({ ...content, isAutoplayEnabled })

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
      <Stack p="2" spacing={4}>
        <Stack>
          {currentTab === 'upload' && (
            <Flex justify="center" py="2">
              <UploadButton
                fileType="audio"
                filePath={fileUploadPath}
                onFileUploaded={updateUrl}
                colorScheme="blue"
              >
                Escolha um arquivo
              </UploadButton>
            </Flex>
          )}
          {currentTab === 'link' && (
            <>
              <TextInput
                placeholder="Cole o link do arquivo de áudio..."
                defaultValue={content.url ?? ''}
                onChange={updateUrl}
              />
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Funciona com .MP3s and .WAVs
              </Text>
            </>
          )}
        </Stack>
        <SwitchWithLabel
          label={'Habilitar tocar sozinho'}
          initialValue={content.isAutoplayEnabled ?? true}
          onCheckChange={updateAutoPlay}
        />
      </Stack>
    </Stack>
  )
}
