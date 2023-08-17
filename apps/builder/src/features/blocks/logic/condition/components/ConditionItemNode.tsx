import { PlusIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useGraph } from '@/features/graph/providers/GraphProvider'
import {
  Fade,
  Flex,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Portal,
  Text,
  useEventListener,
} from '@chakra-ui/react'
import { createId } from '@paralleldrive/cuid2'
import { isNotDefined } from '@typebot.io/lib'
import {
  Comparison,
  ComparisonOperators,
  Condition,
  ConditionItem,
  ItemIndices,
  ItemType,
} from '@typebot.io/schemas'
import React, { useRef } from 'react'
import { ConditionContent } from './ConditionContent'
import { ConditionForm } from './ConditionForm'

type Props = {
  item: ConditionItem
  isMouseOver: boolean
  indices: ItemIndices
}

export const ConditionItemNode = ({ item, isMouseOver, indices }: Props) => {
  const { typebot, createItem, updateItem } = useTypebot()
  const { openedItemId, setOpenedItemId } = useGraph()
  const ref = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => e.stopPropagation()

  const openPopover = () => {
    setOpenedItemId(item.id)
  }

  const updateCondition = (condition: Condition) => {
    updateItem(indices, { ...item, content: condition } as ConditionItem)
  }

  const handlePlusClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    const itemIndex = indices.itemIndex + 1
    const newItemId = createId()
    createItem(
      {
        blockId: item.blockId,
        type: ItemType.CONDITION,
        id: newItemId,
      },
      { ...indices, itemIndex }
    )
    setOpenedItemId(newItemId)
  }

  const handleMouseWheel = (e: WheelEvent) => {
    e.stopPropagation()
  }
  useEventListener('wheel', handleMouseWheel, ref.current)

  return (
    <Popover
      placement="left"
      isLazy
      isOpen={openedItemId === item.id}
      closeOnBlur={false}
    >
      <PopoverAnchor>
        <Flex p={3} pos="relative" w="full" onClick={openPopover}>
          {item.content.comparisons.length === 0 ||
          comparisonIsEmpty(item.content.comparisons[0]) ? (
            <Text color={'gray.500'}>Configurar...</Text>
          ) : (
            <ConditionContent
              condition={item.content}
              variables={typebot?.variables ?? []}
            />
          )}
          <Fade
            in={isMouseOver}
            style={{
              position: 'absolute',
              bottom: '-15px',
              zIndex: 3,
              left: '90px',
            }}
            unmountOnExit
          >
            <IconButton
              aria-label="Adicionar Item"
              icon={<PlusIcon />}
              size="xs"
              shadow="md"
              colorScheme="gray"
              onClick={handlePlusClick}
            />
          </Fade>
        </Flex>
      </PopoverAnchor>
      <Portal>
        <PopoverContent pos="relative" onMouseDown={handleMouseDown}>
          <PopoverArrow />
          <PopoverBody
            py="6"
            overflowY="scroll"
            maxH="400px"
            shadow="lg"
            ref={ref}
          >
            <ConditionForm
              condition={item.content}
              onConditionChange={updateCondition}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

const comparisonIsEmpty = (comparison: Comparison) =>
  isNotDefined(comparison.comparisonOperator) &&
  isNotDefined(comparison.value) &&
  isNotDefined(comparison.variableId)

export const parseComparisonOperatorSymbol = (
  operator: ComparisonOperators
): string => {
  switch (operator) {
    case ComparisonOperators.CONTAINS:
      return 'contém'
    case ComparisonOperators.EQUAL:
      return '='
    case ComparisonOperators.GREATER:
      return '>'
    case ComparisonOperators.IS_SET:
      return 'está definido'
    case ComparisonOperators.LESS:
      return '<'
    case ComparisonOperators.NOT_EQUAL:
      return '!='
    case ComparisonOperators.ENDS_WITH:
      return 'termina com'
    case ComparisonOperators.STARTS_WITH:
      return 'começa com'
    case ComparisonOperators.IS_EMPTY:
      return 'está vazio'
    case ComparisonOperators.NOT_CONTAINS:
      return 'não contém'
  }
}
