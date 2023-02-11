import { Seo } from '@/components/Seo'
import { useToast } from '@/hooks/useToast'
import { Flex, Spinner, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useFolder } from '../hooks/useFolder'
import { TypebotDndProvider } from '../TypebotDndProvider'
import { FolderContent } from './FolderContent'

export const FolderPage = () => {
  const router = useRouter()

  const { showToast } = useToast()

  const { folder } = useFolder({
    folderId: router.query.id?.toString(),
    onError: (error) => {
      showToast({
        title: 'Não foi possível buscar o conteúdo da pasta',
        description: error.message,
      })
    },
  })

  return (
    <Stack minH="100vh">
      <Seo title="Meus typebots" />

      <TypebotDndProvider>
        {!folder ? (
          <Flex flex="1">
            <Spinner mx="auto" />
          </Flex>
        ) : (
          <FolderContent folder={folder} />
        )}
      </TypebotDndProvider>
    </Stack>
  )
}
