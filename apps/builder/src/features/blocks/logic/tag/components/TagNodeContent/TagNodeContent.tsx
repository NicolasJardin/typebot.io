import { HStack, Tag, Text } from '@chakra-ui/react'
import { TagOptions } from 'models'
import { Fragment } from 'react'

type TagNodeContentProps = { options: TagOptions }

export default function TagNodeContent({ options }: TagNodeContentProps) {
  return (
    <Fragment>
      {options.name ? (
        <HStack alignItems="center" justifyContent="center">
          <Text>Criar Tag:</Text>

          <Tag style={{ background: options.color }}>{options.name}</Tag>
        </HStack>
      ) : (
        <Text color="gray.500">Clique para editar...</Text>
      )}
    </Fragment>
  )
}
