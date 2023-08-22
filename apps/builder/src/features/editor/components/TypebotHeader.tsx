import { EditableEmojiOrImageIcon } from '@/components/EditableEmojiOrImageIcon'
import { ChevronLeftIcon, RedoIcon, UndoIcon } from '@/components/icons'
import { PublishButton } from '@/features/publish/components/PublishButton'
import { useUndoShortcut } from '@/hooks/useUndoShortcut'
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react'
import { isDefined, isNotDefined } from '@typebot.io/lib'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { headerHeight } from '../constants'
import { RightPanel, useEditor } from '../providers/EditorProvider'
import { useTypebot } from '../providers/TypebotProvider'
import { EditableTypebotName } from './EditableTypebotName'

export const TypebotHeader = () => {
  const router = useRouter()
  const {
    typebot,
    publishedTypebot,
    updateTypebot,
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    isSavingLoading,
  } = useTypebot()
  const { setRightPanel, rightPanel, setStartPreviewAtGroup } = useEditor()
  const [isUndoShortcutTooltipOpen, setUndoShortcutTooltipOpen] =
    useState(false)
  const hideUndoShortcutTooltipLater = useDebouncedCallback(() => {
    setUndoShortcutTooltipOpen(false)
  }, 1000)

  const handleNameSubmit = (name: string) =>
    updateTypebot({ updates: { name } })

  const handleChangeIcon = (icon: string) =>
    updateTypebot({ updates: { icon } })

  const handlePreviewClick = async () => {
    setStartPreviewAtGroup(undefined)
    save().then()
    setRightPanel(RightPanel.PREVIEW)
  }

  useUndoShortcut(() => {
    if (!canUndo) return
    hideUndoShortcutTooltipLater.flush()
    setUndoShortcutTooltipOpen(true)
    hideUndoShortcutTooltipLater()
    undo()
  })

  return (
    <Flex
      w="full"
      borderBottomWidth="1px"
      justify="center"
      align="center"
      h={`${headerHeight}px`}
      zIndex={100}
      pos="relative"
      bgColor={useColorModeValue('white', 'gray.900')}
      flexShrink={0}
    >
      {/* {isOpen && <SupportBubble autoShowDelay={0} />} */}
      <HStack
        display={['none', 'flex']}
        pos={{ base: 'absolute', xl: 'static' }}
        right={{ base: 280, xl: 0 }}
      >
        <Button
          as={Link}
          href={`/typebots/${typebot?.id}/edit`}
          colorScheme={router.pathname.includes('/edit') ? 'blue' : 'gray'}
          variant={router.pathname.includes('/edit') ? 'outline' : 'ghost'}
          size="sm"
        >
          Fluxo
        </Button>

        {isDefined(publishedTypebot) && (
          <Button
            as={Link}
            href={`/typebots/${typebot?.id}/results`}
            colorScheme={router.pathname.includes('results') ? 'blue' : 'gray'}
            variant={router.pathname.includes('results') ? 'outline' : 'ghost'}
            size="sm"
          >
            Resultados
          </Button>
        )}
      </HStack>
      <HStack
        pos="absolute"
        left="1rem"
        justify="center"
        align="center"
        spacing="6"
      >
        <HStack alignItems="center" spacing={3}>
          <IconButton
            as={Link}
            aria-label="Navigate back"
            icon={<ChevronLeftIcon fontSize={25} />}
            href={
              router.query.parentId
                ? `/typebots/${router.query.parentId}/edit`
                : typebot?.folderId
                ? `/typebots/folders/${typebot.folderId}`
                : '/typebots'
            }
            size="sm"
          />
          <HStack spacing={1}>
            {typebot && (
              <EditableEmojiOrImageIcon
                uploadFilePath={`typebots/${typebot.id}/icon`}
                icon={typebot?.icon}
                onChangeIcon={handleChangeIcon}
              />
            )}
            (
            <EditableTypebotName
              key={`typebot-name-${typebot?.name ?? ''}`}
              defaultName={typebot?.name ?? ''}
              onNewName={handleNameSubmit}
            />
            )
          </HStack>

          <HStack>
            <Tooltip
              label={
                isUndoShortcutTooltipOpen
                  ? 'Alterações revertidas!'
                  : 'Desfazer'
              }
              isOpen={isUndoShortcutTooltipOpen ? true : undefined}
              hasArrow={isUndoShortcutTooltipOpen}
            >
              <IconButton
                display={['none', 'flex']}
                icon={<UndoIcon />}
                size="sm"
                aria-label="Desfazer"
                onClick={undo}
                isDisabled={!canUndo}
              />
            </Tooltip>

            <Tooltip label="Refazer">
              <IconButton
                display={['none', 'flex']}
                icon={<RedoIcon />}
                size="sm"
                aria-label="Refazer"
                onClick={redo}
                isDisabled={!canRedo}
              />
            </Tooltip>
          </HStack>
        </HStack>
        {isSavingLoading && (
          <HStack>
            <Spinner speed="0.7s" size="sm" color="gray.400" />
            <Text fontSize="sm" color="gray.400">
              Salvando...
            </Text>
          </HStack>
        )}
      </HStack>

      <HStack right="40px" pos="absolute" display={['none', 'flex']}>
        {router.pathname.includes('/edit') && isNotDefined(rightPanel) && (
          <Button
            colorScheme="gray"
            onClick={handlePreviewClick}
            isLoading={isNotDefined(typebot)}
            size="sm"
          >
            Pŕe-visualização
          </Button>
        )}
        <PublishButton size="sm" />
      </HStack>
    </Flex>
  )
}
