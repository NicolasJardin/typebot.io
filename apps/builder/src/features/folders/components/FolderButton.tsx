import { ConfirmModal } from '@/components/ConfirmModal'
import { FolderIcon, MoreVerticalIcon } from '@/components/icons'
import { useToast } from '@/hooks/useToast'
import { useI18n } from '@/locales'
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  SkeletonText,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  WrapItem,
} from '@chakra-ui/react'
import { DashboardFolder } from '@typebot.io/prisma'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { deleteFolderQuery } from '../queries/deleteFolderQuery'
import { updateFolderQuery } from '../queries/updateFolderQuery'
import { useTypebotDnd } from '../TypebotDndProvider'

export const FolderButton = ({
  folder,
  onFolderDeleted,
  onFolderRenamed,
}: {
  folder: DashboardFolder
  onFolderDeleted: () => void
  onFolderRenamed: (newName: string) => void
}) => {
  const t = useI18n()
  const router = useRouter()
  const { draggedTypebot, setMouseOverFolderId, mouseOverFolderId } =
    useTypebotDnd()
  const isTypebotOver = useMemo(
    () => draggedTypebot && mouseOverFolderId === folder.id,
    [draggedTypebot, folder.id, mouseOverFolderId]
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { showToast } = useToast()

  const onDeleteClick = async () => {
    const { error } = await deleteFolderQuery(folder.id)
    return error
      ? showToast({
          title: 'Não foi possível excluir a pasta',
          description: error.message,
        })
      : onFolderDeleted()
  }

  const onRenameSubmit = async (newName: string) => {
    if (newName === '' || newName === folder.name) return
    const { error } = await updateFolderQuery(folder.id, { name: newName })
    return error
      ? showToast({ title: t('errorMessage'), description: error.message })
      : onFolderRenamed(newName)
  }

  const handleClick = () => {
    router.push(`/typebots/folders/${folder.id}`)
  }

  const handleMouseEnter = () => setMouseOverFolderId(folder.id)
  const handleMouseLeave = () => setMouseOverFolderId(undefined)
  return (
    <Button
      as={WrapItem}
      style={{ width: '225px', height: '270px' }}
      paddingX={6}
      whiteSpace={'normal'}
      pos="relative"
      cursor="pointer"
      variant="outline"
      colorScheme={isTypebotOver ? 'blue' : 'gray'}
      borderWidth={isTypebotOver ? '3px' : '1px'}
      justifyContent="center"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<MoreVerticalIcon />}
          aria-label={`Show ${folder.name} menu`}
          onClick={(e) => e.stopPropagation()}
          colorScheme="gray"
          variant="outline"
          size="sm"
          pos="absolute"
          top="5"
          right="5"
        />
        <MenuList>
          <MenuItem
            color="red"
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
          >
            Excluir
          </MenuItem>
        </MenuList>
      </Menu>
      <VStack spacing="4">
        <FolderIcon
          fontSize={50}
          color={useColorModeValue('blue.500', 'blue.400')}
        />
        <Editable
          defaultValue={folder.name}
          fontSize="18"
          onClick={(e) => e.stopPropagation()}
          onSubmit={onRenameSubmit}
        >
          <EditablePreview
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700'),
            }}
            px="2"
            textAlign="center"
          />
          <EditableInput textAlign="center" />
        </Editable>
      </VStack>

      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        confirmButtonLabel={'Delete'}
        message={
          <Text>
            Tem certeza de que deseja excluir a pasta{' '}
            <strong>{folder.name}</strong>? (Tudo dentro será movido para o seu
            painel)
          </Text>
        }
        title={`Deletar ${folder.name}?`}
        onConfirm={onDeleteClick}
        confirmButtonColor="red"
      />
    </Button>
  )
}

export const ButtonSkeleton = () => (
  <Button
    as={VStack}
    style={{ width: '225px', height: '270px' }}
    paddingX={6}
    whiteSpace={'normal'}
    pos="relative"
    cursor="pointer"
    variant="outline"
  >
    <VStack spacing="6" w="full">
      <SkeletonCircle boxSize="45px" />
      <SkeletonText noOfLines={2} w="full" />
    </VStack>
  </Button>
)
