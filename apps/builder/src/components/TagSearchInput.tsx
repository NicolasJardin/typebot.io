import {
  useDisclosure,
  Flex,
  Popover,
  Input,
  PopoverContent,
  Button,
  InputProps,
  IconButton,
  HStack,
  useColorModeValue,
  PopoverAnchor,
  Portal,
  Tag as TagComponent,
} from '@chakra-ui/react'
import { EditIcon, PlusIcon, TrashIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor/providers/TypebotProvider/TypebotProvider'
import cuid from 'cuid'
import { Tag } from 'models'
import React, { useState, useRef, ChangeEvent, useEffect } from 'react'
import { byId, isDefined, isNotDefined } from 'utils'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'

type Props = {
  initialTagId?: string
  autoFocus?: boolean
  onSelectTag: (tag: Pick<Tag, 'id' | 'name'>) => void
} & InputProps

export const TagSearchInput = ({
  initialTagId,
  onSelectTag,
  autoFocus,
  ...inputProps
}: Props) => {
  const bg = useColorModeValue('gray.200', 'gray.700')
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { typebot, createTag, updateTag, deleteTag } = useTypebot()
  const tags = typebot?.tags ?? []
  const [inputValue, setInputValue] = useState(
    tags.find(byId(initialTagId))?.name ?? ''
  )
  const [filteredItems, setFilteredItems] = useState<Tag[]>(tags ?? [])
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState<
    number | undefined
  >()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const createTagItemRef = useRef<HTMLButtonElement | null>(null)
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([])
  const { ref: parentModalRef } = useParentModal()

  useOutsideClick({
    ref: dropdownRef,
    handler: onClose,
  })

  useEffect(() => {
    if (autoFocus) onOpen()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (e.target.value === '') {
      setFilteredItems([...tags.slice(0, 50)])
      return
    }
    setFilteredItems([
      ...tags
        .filter((item) =>
          item.name.toLowerCase().includes((e.target.value ?? '').toLowerCase())
        )
        .slice(0, 50),
    ])
  }

  const handleTagNameClick = (tag: Tag) => () => {
    setInputValue(tag.name)
    onSelectTag(tag)
    setKeyboardFocusIndex(undefined)
    inputRef.current?.blur()
    onClose()
  }

  const handleCreateNewTagClick = () => {
    if (!inputValue || inputValue === '') return
    const id = 'v' + cuid()
    onSelectTag({ id, name: inputValue })
    createTag({ id, name: inputValue })
    inputRef.current?.blur()
    onClose()
  }

  const handleDeleteTagClick = (tag: Tag) => (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTag(tag.id)
    setFilteredItems(filteredItems.filter((item) => item.id !== tag.id))
    if (tag.name === inputValue) {
      setInputValue('')
    }
  }

  const handleRenameTagClick = (tag: Tag) => (e: React.MouseEvent) => {
    e.stopPropagation()
    const name = prompt('Renomear tag', tag.name)
    if (!name) return
    updateTag(tag.id, { name })
    setFilteredItems(
      filteredItems.map((item) =>
        item.id === tag.id ? { ...item, name } : item
      )
    )
  }

  const isCreateTagButtonDisplayed =
    (inputValue?.length ?? 0) > 0 &&
    isNotDefined(tags.find((v) => v.name === inputValue))

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isDefined(keyboardFocusIndex)) {
      if (keyboardFocusIndex === 0 && isCreateTagButtonDisplayed)
        handleCreateNewTagClick()
      else
        handleTagNameClick(
          filteredItems[
            keyboardFocusIndex - (isCreateTagButtonDisplayed ? 1 : 0)
          ]
        )()
      return setKeyboardFocusIndex(undefined)
    }
    if (e.key === 'ArrowDown') {
      if (keyboardFocusIndex === undefined) return setKeyboardFocusIndex(0)
      if (keyboardFocusIndex >= filteredItems.length) return
      itemsRef.current[keyboardFocusIndex + 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
      return setKeyboardFocusIndex(keyboardFocusIndex + 1)
    }
    if (e.key === 'ArrowUp') {
      if (keyboardFocusIndex === undefined) return
      if (keyboardFocusIndex <= 0) return setKeyboardFocusIndex(undefined)
      itemsRef.current[keyboardFocusIndex - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
      return setKeyboardFocusIndex(keyboardFocusIndex - 1)
    }
    return setKeyboardFocusIndex(undefined)
  }

  return (
    <Flex ref={dropdownRef} w="full">
      <Popover
        isOpen={isOpen}
        initialFocusRef={inputRef}
        matchWidth
        isLazy
        offset={[0, 2]}
      >
        <PopoverAnchor>
          <Input
            data-testid="tags-input"
            ref={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onFocus={onOpen}
            onKeyUp={handleKeyUp}
            placeholder={inputProps.placeholder ?? 'Selecione uma tag'}
            {...inputProps}
          />
        </PopoverAnchor>
        <Portal containerRef={parentModalRef}>
          <PopoverContent
            maxH="35vh"
            overflowY="scroll"
            role="menu"
            w="inherit"
            shadow="lg"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isCreateTagButtonDisplayed && (
              <Button
                ref={createTagItemRef}
                role="menuitem"
                minH="40px"
                onClick={handleCreateNewTagClick}
                fontSize="16px"
                fontWeight="normal"
                rounded="none"
                colorScheme="gray"
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<PlusIcon />}
                bgColor={keyboardFocusIndex === 0 ? bg : 'transparent'}
              >
                Criar
                <TagComponent colorScheme="orange" ml="1">
                  {inputValue}
                </TagComponent>
              </Button>
            )}
            {filteredItems.length > 0 && (
              <>
                {filteredItems.map((item, idx) => {
                  const indexInList = isCreateTagButtonDisplayed ? idx + 1 : idx
                  return (
                    <Button
                      ref={(el) => (itemsRef.current[idx] = el)}
                      role="menuitem"
                      minH="40px"
                      key={idx}
                      onClick={handleTagNameClick(item)}
                      fontSize="16px"
                      fontWeight="normal"
                      rounded="none"
                      colorScheme="gray"
                      variant="ghost"
                      justifyContent="space-between"
                      bgColor={
                        keyboardFocusIndex === indexInList ? bg : 'transparent'
                      }
                    >
                      {item.name}
                      <HStack>
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Renomear tag"
                          size="xs"
                          onClick={handleRenameTagClick(item)}
                        />
                        <IconButton
                          icon={<TrashIcon />}
                          aria-label="Remover tag"
                          size="xs"
                          onClick={handleDeleteTagClick(item)}
                        />
                      </HStack>
                    </Button>
                  )
                })}
              </>
            )}
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  )
}
