import { Text } from '@chakra-ui/react'
import { TagOptions } from 'models'

type TagNodeContentProps = { options: TagOptions }

export default function TagNodeContent({ options }: TagNodeContentProps) {
  return (
    <Text color={!options.name ? 'gray.500' : ''}>
      {options.name || 'Clique para editar...'}
    </Text>
  )
}
