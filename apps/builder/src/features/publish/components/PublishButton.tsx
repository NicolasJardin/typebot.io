import { ChevronLeftIcon, CloudOffIcon } from '@/components/icons'
import { ChangePlanModal } from '@/features/billing/components/ChangePlanModal'
import { isFreePlan } from '@/features/billing/helpers/isFreePlan'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { parseTimeSince } from '@/helpers/parseTimeSince'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/lib/trpc'
import { useI18n } from '@/locales'
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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { isNotDefined } from '@typebot.io/lib'
import { InputBlockType } from '@typebot.io/schemas'
import { parseDefaultPublicId } from '../helpers/parseDefaultPublicId'

type Props = ButtonProps & {
  isMoreMenuDisabled?: boolean
}
export const PublishButton = ({
  isMoreMenuDisabled = false,
  ...props
}: Props) => {
  const t = useI18n()
  const warningTextColor = useColorModeValue('red.300', 'red.600')
  const { workspace } = useWorkspace()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isPublished,
    publishedTypebot,
    restorePublishedTypebot,
    typebot,
    isSavingLoading,
    updateTypebot,
    save,
  } = useTypebot()
  const { showToast } = useToast()

  const {
    typebot: {
      getPublishedTypebot: { refetch: refetchPublishedTypebot },
    },
  } = trpc.useContext()

  const { mutate: publishTypebotMutate, isLoading: isPublishing } =
    trpc.typebot.publishTypebot.useMutation({
      onError: (error) =>
        showToast({
          title: 'Error while publishing typebot',
          description: error.message,
        }),
      onSuccess: () => {
        refetchPublishedTypebot({
          typebotId: typebot?.id as string,
        })
      },
    })

  const { mutate: unpublishTypebotMutate, isLoading: isUnpublishing } =
    trpc.typebot.unpublishTypebot.useMutation({
      onError: (error) =>
        showToast({
          title: 'Error while unpublishing typebot',
          description: error.message,
        }),
      onSuccess: () => {
        refetchPublishedTypebot()
      },
    })

  const hasInputFile = typebot?.groups
    .flatMap((g) => g.blocks)
    .some((b) => b.type === InputBlockType.FILE)

  const handlePublishClick = async () => {
    if (!typebot?.id) return
    if (isFreePlan(workspace) && hasInputFile) return onOpen()
    if (!typebot.publicId) {
      await updateTypebot({
        updates: {
          publicId: parseDefaultPublicId(typebot.name, typebot.id),
        },
        save: true,
      })
    } else await save()
    publishTypebotMutate({
      typebotId: typebot.id,
    })
  }

  const unpublishTypebot = async () => {
    if (!typebot?.id) return
    if (typebot.isClosed)
      await updateTypebot({ updates: { isClosed: false }, save: true })
    unpublishTypebotMutate({
      typebotId: typebot?.id,
    })
  }

  return (
    <HStack spacing="1px">
      <ChangePlanModal
        isOpen={isOpen}
        onClose={onClose}
        type={t('billing.limitMessage.fileInput')}
      />
      <Tooltip
        placement="bottom-end"
        label={
          <Stack>
            {!publishedTypebot?.version ? (
              <Text color={warningTextColor} fontWeight="semibold">
                Isso implantará seu bot com um mecanismo atualizado. Tenha
                certeza de teste-o corretamente no modo de visualização antes de
                publicar.
              </Text>
            ) : (
              <Text>Existem alterações não publicadas.</Text>
            )}
            <Text fontStyle="italic">
              Versão publicada de{' '}
              {publishedTypebot &&
                parseTimeSince(publishedTypebot.updatedAt.toString())}{' '}
              atrás
            </Text>
          </Stack>
        }
        isDisabled={isNotDefined(publishedTypebot) || isPublished}
      >
        <Button
          colorScheme="blue"
          isLoading={isPublishing || isUnpublishing}
          isDisabled={isPublished || isSavingLoading}
          onClick={handlePublishClick}
          borderRightRadius={
            publishedTypebot && !isMoreMenuDisabled ? 0 : undefined
          }
          {...props}
        >
          {isPublished
            ? typebot?.isClosed
              ? 'Fechado'
              : 'Publicado'
            : 'Publicar'}
        </Button>
      </Tooltip>

      {!isMoreMenuDisabled && publishedTypebot && (
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

            <MenuItem onClick={unpublishTypebot} icon={<CloudOffIcon />}>
              Cancelar publicação do typebot
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </HStack>
  )
}
