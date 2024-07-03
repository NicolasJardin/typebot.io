import React from 'react'
import { Text } from '@chakra-ui/react'
import { TextInputOptions, TextWaitType } from '@typebot.io/schemas'
import { WithVariableContent } from '@/features/graph/components/nodes/block/WithVariableContent'

type Props = {
  placeholder: TextInputOptions['labels']['placeholder']
  isLong: TextInputOptions['isLong']
  variableId?: string
  wait?: TextWaitType
}

export const TextInputNodeContent = ({
  placeholder,
  isLong,
  variableId,
  wait,
}: Props) => {
  if (variableId)
    return (
      <WithVariableContent
        variableId={variableId}
        h={isLong ? '100px' : 'auto'}
        wait={wait}
      />
    )
  return (
    <Text color={'gray.500'} h={isLong ? '100px' : 'auto'}>
      {placeholder}
    </Text>
  )
}
