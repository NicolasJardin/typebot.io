import {
  Popover,
  Flex,
  Tooltip,
  IconButton,
  PopoverContent,
  IconButtonProps,
  useDisclosure,
  PopoverAnchor,
} from '@chakra-ui/react'
import { UserIcon } from '@/components/icons'
import { Variable } from 'models'
import React, { useRef } from 'react'
import { VariableSearchInput } from '@/components/VariableSearchInput'
import { useOutsideClick } from '@/hooks/useOutsideClick'

type Props = {
  onSelectVariable: (variable: Pick<Variable, 'name' | 'id'>) => void
} & Omit<IconButtonProps, 'aria-label'>

export const VariablesButton = ({ onSelectVariable, ...props }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const popoverRef = useRef<HTMLDivElement>(null)

  useOutsideClick({
    ref: popoverRef,
    handler: onClose,
  })

  return (
    <Popover isLazy placement="bottom-end" gutter={0} isOpen={isOpen}>
      <PopoverAnchor>
        <Flex>
          <Tooltip label="Insira uma variável">
            <IconButton
              aria-label={'Insira uma variável'}
              icon={<UserIcon />}
              pos="relative"
              onClick={onOpen}
              {...props}
            />
          </Tooltip>
        </Flex>
      </PopoverAnchor>
      <PopoverContent w="full" ref={popoverRef}>
        <VariableSearchInput
          onSelectVariable={(variable) => {
            onClose()
            if (variable) onSelectVariable(variable)
          }}
          placeholder="Pesquisar uma variável"
          shadow="lg"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
