import {
  ChevronLeftIcon,
  CloudOffIcon,
  LockedIcon,
  UnlockedIcon,
} from '@/components/icons'
import { ChangePlanModal, isFreePlan, LimitReached } from '@/features/billing'
import { useTypebot } from '@/features/editor'
import { useWorkspace } from '@/features/workspace'
import { timeSince } from '@/utils/helpers'
import {
  Button,
  ButtonProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { InputBlockType } from 'models'
import { isNotDefined } from 'utils'

export const PublishButton = (props: ButtonProps) => {
  const { workspace } = useWorkspace()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isPublishing,
    isPublished,
    publishTypebot,
    publishedTypebot,
    restorePublishedTypebot,
    typebot,
    isSavingLoading,
    updateTypebot,
    unpublishTypebot,
    save,
  } = useTypebot()

  const hasInputFile = typebot?.groups
    .flatMap((g) => g.blocks)
    .some((b) => b.type === InputBlockType.FILE)

  const handlePublishClick = () => {
    if (isFreePlan(workspace) && hasInputFile) return onOpen()
    publishTypebot()
  }

  const closeTypebot = async () => {
    updateTypebot({ isClosed: true })
    await save()
  }

  const openTypebot = async () => {
    updateTypebot({ isClosed: false })
    await save()
  }

  return (
    <HStack spacing="1px">
      <ChangePlanModal
        isOpen={isOpen}
        onClose={onClose}
        type={LimitReached.FILE_INPUT}
      />
      <Tooltip
        borderRadius="md"
        hasArrow
        placement="bottom-end"
        label={
          <Stack>
            <Text>Existem alterações não publicadas.</Text>
            <Text fontStyle="italic">
              Versão publicada de{' '}
              {publishedTypebot &&
                timeSince(publishedTypebot.updatedAt.toString())}{' '}
              atrás
            </Text>
          </Stack>
        }
        isDisabled={isNotDefined(publishedTypebot) || isPublished}
      >
        <Button
          colorScheme="blue"
          isLoading={isPublishing || isSavingLoading}
          isDisabled={isPublished}
          onClick={handlePublishClick}
          borderRightRadius={publishedTypebot ? 0 : undefined}
          {...props}
        >
          {isPublished
            ? typebot?.isClosed
              ? 'Fechado'
              : 'Publicado'
            : 'Publicar'}
        </Button>
      </Tooltip>

      {publishedTypebot && (
        <Menu>
          <MenuButton
            as={IconButton}
            colorScheme={'blue'}
            borderLeftRadius={0}
            icon={<ChevronLeftIcon transform="rotate(-90deg)" />}
            aria-label="Mostrar menu typebot publicado"
            size="sm"
            isDisabled={isPublishing || isSavingLoading}
          />
          <MenuList>
            {!isPublished && (
              <MenuItem onClick={restorePublishedTypebot}>
                Restaurar versão publicada
              </MenuItem>
            )}
            {!typebot?.isClosed ? (
              <MenuItem onClick={closeTypebot} icon={<LockedIcon />}>
                Feche o typebot para novas respostas
              </MenuItem>
            ) : (
              <MenuItem onClick={openTypebot} icon={<UnlockedIcon />}>
                Reabrir typebot para novas respostas
              </MenuItem>
            )}
            <MenuItem onClick={unpublishTypebot} icon={<CloudOffIcon />}>
              Cancelar publicação do typebot
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}
