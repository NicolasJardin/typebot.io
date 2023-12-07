import { DownloadIcon, ToolIcon } from '@/components/icons'
import { useUser } from '@/features/account/hooks/useUser'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/lib/trpc'
import { CreatePasswordModal } from '@/modules/flow'
import {
  Button,
  Heading,
  Stack,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { TypebotUpdate } from '@typebot.io/schemas'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ImportTypebotFromFileButton } from './ImportTypebotFromFileButton'
import { TemplatesModal } from './TemplatesModal'

export const CreateNewTypebotButtons = () => {
  const { workspace } = useWorkspace()
  const { user } = useUser()
  const router = useRouter()
  const { isOpen, onClose } = useDisclosure()

  const {
    isOpen: isOpenPasswordModal,
    onClose: onClosePasswordModal,
    onOpen: onOpenPasswordModal,
  } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useToast()

  const { mutate } = trpc.typebot.createTypebot.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onError: (error) => {
      showToast({ description: error.message })
      setIsLoading(false)
    },
    onSuccess: (data) => {
      router.push({
        pathname: `/typebots/${data.typebot.id}/edit`,
        query:
          router.query.isFirstBot === 'true'
            ? {
                isFirstBot: 'true',
              }
            : {},
      })
    },
  })

  const handleCreateSubmit = async (typebot?: Partial<TypebotUpdate>) => {
    if (!user || !workspace) return
    const folderId = router.query.folderId?.toString() ?? null
    mutate({
      workspaceId: workspace.id,
      typebot: {
        ...(typebot
          ? {
              ...typebot,
              publicId: undefined,
              customDomain: undefined,
            }
          : {}),
        folderId,
      },
    })
  }

  return (
    <VStack maxW="600px" w="full" flex="1" pt="20" spacing={10}>
      <CreatePasswordModal
        isOpen={isOpenPasswordModal}
        onClose={onClosePasswordModal}
        onSave={handleCreateSubmit}
        isLoading={isLoading}
      />
      <Heading>Criar um novo fluxo</Heading>
      <Stack w="full" spacing={6}>
        <Button
          variant="outline"
          w="full"
          py="8"
          fontSize="lg"
          leftIcon={
            <ToolIcon
              color={useColorModeValue('blue.500', 'blue.300')}
              boxSize="25px"
              mr="2"
            />
          }
          onClick={onOpenPasswordModal}
          isLoading={isLoading}
        >
          Começar do zero
        </Button>

        <ImportTypebotFromFileButton
          variant="outline"
          w="full"
          py="8"
          fontSize="lg"
          leftIcon={
            <DownloadIcon
              color={useColorModeValue('purple.500', 'purple.300')}
              boxSize="25px"
              mr="2"
            />
          }
          isLoading={isLoading}
          onNewTypebot={handleCreateSubmit}
        >
          Importar um arquivo
        </ImportTypebotFromFileButton>
      </Stack>
      <TemplatesModal
        isOpen={isOpen}
        onClose={onClose}
        onTypebotChoose={handleCreateSubmit}
      />
    </VStack>
  )
}
