import { chakra, Stack, Text, TextProps } from '@chakra-ui/react'
import React from 'react'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { byId } from '@typebot.io/lib'
import { IoTimeOutline } from 'react-icons/io5'
import { TextWaitType } from '@typebot.io/schemas'

type Props = {
  variableId: string
  wait?: TextWaitType
} & TextProps

export const WithVariableContent = ({ variableId, ...props }: Props) => {
  const { typebot } = useTypebot()
  const variableName = typebot?.variables.find(byId(variableId))?.name

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Text w="calc(100% - 25px)" {...props}>
        Coletar{' '}
        <chakra.span
          bgColor="orange.400"
          color="white"
          rounded="md"
          py="0.5"
          px="1"
        >
          {variableName}
        </chakra.span>
      </Text>

      {!!props.wait?.number && <IoTimeOutline size={20} />}
    </Stack>
  )
}
