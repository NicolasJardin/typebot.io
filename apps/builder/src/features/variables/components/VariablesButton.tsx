import {
  Popover,
  PopoverTrigger,
  Flex,
  Tooltip,
  IconButton,
  PopoverContent,
  IconButtonProps,
} from '@chakra-ui/react'
import { UserIcon } from '@/components/icons'
import { Variable } from 'models'
import React from 'react'
import { VariableSearchInput } from '@/components/VariableSearchInput'

type Props = {
  onSelectVariable: (variable: Pick<Variable, 'name' | 'id'>) => void
} & Omit<IconButtonProps, 'aria-label'>

export const VariablesButton = ({ onSelectVariable, ...props }: Props) => {
  return (
    <Popover isLazy placement="bottom-end" gutter={0}>
      <PopoverTrigger>
        <Flex>
          <Tooltip label="Insira uma variável">
            <IconButton
              aria-label={'Insira uma variável'}
              icon={<UserIcon />}
              pos="relative"
              {...props}
            />
          </Tooltip>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="full">
        <VariableSearchInput
          onSelectVariable={onSelectVariable}
          placeholder="Pesquisar uma variável"
          shadow="lg"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
