import { PlusIcon } from '@/components/icons'
import { useParentModal } from '@/features/graph/providers/ParentModalProvider'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { Tag as TagType } from '@/whatsflow/api/tag/interfaces/domain/Tag'
import useCreateTag from '@/whatsflow/api/tag/mutations/useCreateTag'
import useGetTags from '@/whatsflow/api/tag/queries/useGetTags'
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Portal,
  Spinner,
  Tag,
  Tag as TagComponent,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { TagOptions } from 'models'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { isDefined, isNotDefined } from 'utils'

type Props = {
  defaultTagName?: string
  autoFocus?: boolean
  onSelectTag: (tag: TagOptions) => void
} & InputProps

export const TagSearchInput = ({
  onSelectTag,
  autoFocus,
  defaultTagName,
  ...inputProps
}: Props) => {
  const { data, refetch, isFetching } = useGetTags()
  const { mutateAsync: createTag } = useCreateTag({
    onSuccess: () => {
      refetch()
    },
  })

  const tags = useMemo(() => data || [], [data])

  const bg = useColorModeValue('gray.200', 'gray.700')
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [inputValue, setInputValue] = useState(defaultTagName || '')
  const [filteredItems, setFilteredItems] = useState<TagType[]>(tags)
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

  const handleTagNameClick = (tag: TagType) => () => {
    setInputValue(tag.name)
    onSelectTag(tag)
    setKeyboardFocusIndex(undefined)
    inputRef.current?.blur()
    onClose()
  }

  const handleCreateNewTagClick = () => {
    if (!inputValue || inputValue === '') return
    onSelectTag({ name: inputValue, color: '#808080' })
    createTag({ name: inputValue, color: '#808080' })
    inputRef.current?.blur()
    onClose()
  }

  const isCreateTagButtonDisplayed =
    (inputValue?.length ?? 0) > 0 &&
    isNotDefined(
      tags.find((v) => v.name.toLowerCase() === inputValue?.toLowerCase())
    )

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

  useEffect(() => {
    setFilteredItems(tags)
  }, [tags])

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
          <InputGroup>
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

            {isFetching && (
              <InputRightElement>
                <Spinner speed="0.7s" size="sm" />
              </InputRightElement>
            )}
          </InputGroup>
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
                      <HStack>
                        <Tag
                          size="sm"
                          style={{ background: item.color }}
                          borderRadius="full"
                        />

                        <Text>{item.name}</Text>
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
