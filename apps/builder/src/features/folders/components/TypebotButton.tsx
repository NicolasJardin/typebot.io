import { ConfirmModal } from '@/components/ConfirmModal'
import { EmojiOrImageIcon } from '@/components/EmojiOrImageIcon'
import { GripIcon } from '@/components/icons'
import { TypebotInDashboard } from '@/features/dashboard/types'
import { duplicateName } from '@/features/typebot/helpers/duplicateName'
import { isMobile } from '@/helpers/isMobile'
import { useToast } from '@/hooks/useToast'
import { trpc, trpcVanilla } from '@/lib/trpc'
import { useScopedI18n } from '@/locales'
import {
  ChangePasswordModal,
  CreatePasswordModal,
  EnterPasswordModal,
} from '@/modules/flow'
import {
  Button,
  Flex,
  IconButton,
  MenuItem,
  Tag,
  Text,
  VStack,
  WrapItem,
  useDisclosure,
} from '@chakra-ui/react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { useTypebotDnd } from '../TypebotDndProvider'
import { MoreButton } from './MoreButton'

type Props = {
  typebot: TypebotInDashboard
  isReadOnly?: boolean
  onTypebotUpdated: () => void
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const TypebotButton = ({
  typebot,
  isReadOnly = false,
  onTypebotUpdated,
  onMouseDown,
}: Props) => {
  const scopedT = useScopedI18n('folders.typebotButton')
  const router = useRouter()
  const { draggedTypebot } = useTypebotDnd()
  const [draggedTypebotDebounced] = useDebounce(draggedTypebot, 200)
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const { showToast } = useToast()

  const { mutate: createTypebot } = trpc.typebot.createTypebot.useMutation({
    onError: (error) => {
      showToast({ description: error.message })
    },
    onSuccess: ({ typebot }) => {
      router.push(`/typebots/${typebot.id}/edit`)
    },
  })

  const { mutate: deleteTypebot } = trpc.typebot.deleteTypebot.useMutation({
    onError: (error) => {
      showToast({ description: error.message })
    },
    onSuccess: () => {
      onTypebotUpdated()
    },
  })

  const { mutate: unpublishTypebot } =
    trpc.typebot.unpublishTypebot.useMutation({
      onError: (error) => {
        showToast({ description: error.message })
      },
      onSuccess: () => {
        onTypebotUpdated()
      },
    })

  const {
    isOpen: isOpenPasswordModal,
    onClose: onClosePasswordModal,
    onOpen: onOpenPasswordModal,
  } = useDisclosure()

  const {
    isOpen: isOpenCreatePasswordModal,
    onClose: onCloseCreatePasswordModal,
    onOpen: onOpenCreatePasswordModal,
  } = useDisclosure()

  const {
    isOpen: isOpenChangePasswordModal,
    onClose: onCloseChangePasswordModal,
    onOpen: onOpenChangePasswordModal,
  } = useDisclosure()

  const currentTypebotToken = useMemo(
    () => getCookie(`unlock-${typebot?.id}`) as string,
    [typebot?.id]
  )

  const { data } = trpc.typebot.verifyIfTypebotIsUnlocked.useQuery(
    {
      typebotId: typebot?.id || '',
      token: currentTypebotToken,
    },
    {
      enabled: Boolean(typebot?.id) && Boolean(currentTypebotToken),
    }
  )

  const { mutate: updateTypebot, isLoading: isUpdatingTypebot } =
    trpc.typebot.updateTypebot.useMutation({
      onError: (error) => {
        showToast({ description: error.message })
      },
      onSuccess: () => {
        showToast({
          description: 'Senha adicionada com sucesso!',
          status: 'success',
        })
        onCloseCreatePasswordModal()
        onTypebotUpdated()
      },
    })

  const handleTypebotClick = () => {
    if (typebot.hasPassword && !data?.unlocked) return onOpenPasswordModal()

    if (draggedTypebotDebounced) return
    router.push(
      isMobile
        ? `/typebots/${typebot.id}/results`
        : `/typebots/${typebot.id}/edit`
    )
  }

  const handleDeleteTypebotClick = async () => {
    if (isReadOnly) return
    deleteTypebot({
      typebotId: typebot.id,
    })
  }

  const handleDuplicateClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const { typebot: typebotToDuplicate } =
      await trpcVanilla.typebot.getTypebot.query({
        typebotId: typebot.id,
      })
    if (!typebotToDuplicate) return
    createTypebot({
      workspaceId: typebotToDuplicate.workspaceId,
      typebot: {
        ...typebotToDuplicate,
        customDomain: undefined,
        publicId: undefined,
        name: duplicateName(typebotToDuplicate.name),
      },
    })
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteOpen()
  }

  const handleUnpublishClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!typebot.publishedTypebotId) return
    unpublishTypebot({ typebotId: typebot.id })
  }

  const handleChangePasswordClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      if (typebot.hasPassword) return onOpenChangePasswordModal()

      return onOpenCreatePasswordModal()
    },
    [typebot.hasPassword, onOpenCreatePasswordModal, onOpenChangePasswordModal]
  )

  return (
    <Button
      as={WrapItem}
      onClick={handleTypebotClick}
      display="flex"
      flexDir="column"
      variant="outline"
      w="225px"
      h="270px"
      rounded="lg"
      whiteSpace="normal"
      opacity={draggedTypebot?.id === typebot.id ? 0.2 : 1}
      onMouseDown={onMouseDown}
      cursor="pointer"
    >
      <EnterPasswordModal
        isOpen={isOpenPasswordModal}
        onClose={onClosePasswordModal}
        typebot={typebot}
      />

      <CreatePasswordModal
        isOpen={isOpenCreatePasswordModal}
        onClose={onCloseCreatePasswordModal}
        onSave={(data) =>
          updateTypebot({
            typebotId: typebot.id,
            typebot: { password: data?.password },
          })
        }
        isUpdatingTypebot
        isLoading={isUpdatingTypebot}
      />
      <ChangePasswordModal
        isOpen={isOpenChangePasswordModal}
        onClose={onCloseChangePasswordModal}
        typebot={typebot}
      />
      {typebot.publishedTypebotId && (
        <Tag
          colorScheme="blue"
          variant="solid"
          rounded="full"
          pos="absolute"
          top="27px"
          size="sm"
        >
          Ativo
        </Tag>
      )}
      {!isReadOnly && (
        <>
          <IconButton
            icon={<GripIcon />}
            pos="absolute"
            top="20px"
            left="20px"
            aria-label="Drag"
            cursor="grab"
            variant="ghost"
            colorScheme="blue"
            size="sm"
          />
          <MoreButton
            pos="absolute"
            top="20px"
            right="20px"
            aria-label={scopedT('showMoreOptions')}
          >
            {typebot.publishedTypebotId && (
              <MenuItem onClick={handleUnpublishClick}>
                Cancelar publicação
              </MenuItem>
            )}
            <MenuItem onClick={handleChangePasswordClick}>
              {typebot.hasPassword ? 'Editar senha' : 'Adicionar senha'}
            </MenuItem>
            <MenuItem onClick={handleDuplicateClick}>Duplicar</MenuItem>
            <MenuItem color="red.400" onClick={handleDeleteClick}>
              Deletar
            </MenuItem>
          </MoreButton>
        </>
      )}
      <VStack spacing="4">
        <Flex
          rounded="full"
          justifyContent="center"
          alignItems="center"
          fontSize={'4xl'}
        >
          {<EmojiOrImageIcon icon={typebot.icon} boxSize={'35px'} />}
        </Flex>
        <Text textAlign="center" noOfLines={4} maxW="180px">
          {typebot.name}
        </Text>
      </VStack>
      {!isReadOnly && (
        <ConfirmModal
          message={
            <Text>
              Tem certeza de que deseja excluir seu fluxo {typebot.name}?
              <br />
              Todos os dados associados serão perdidos.
            </Text>
          }
          confirmButtonLabel="Delete"
          onConfirm={handleDeleteTypebotClick}
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
        />
      )}
    </Button>
  )
}
