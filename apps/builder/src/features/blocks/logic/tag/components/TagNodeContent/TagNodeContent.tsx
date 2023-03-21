import { HStack, Tag, Text } from '@chakra-ui/react'
import { TagOptions } from '@typebot.io/schemas'
import { Fragment } from 'react'

type TagNodeContentProps = { options: TagOptions }

export default function TagNodeContent({ options }: TagNodeContentProps) {
  return (
    <Fragment>
      {options.name ? (
        <HStack alignItems="center" justifyContent="center">
          <Text>Criar Tag:</Text>

          <Tag
            size="sm"
            sx={{
              minWidth: 1,
              minHeight: 1,
              height: 4,
              width: 4,
            }}
            style={{ background: options.color }}
            borderRadius="full"
          />

          <Text>{options.name}</Text>
        </HStack>
      ) : (
        <Text color="gray.500">Clique para editar...</Text>
      )}
    </Fragment>
  )
}
