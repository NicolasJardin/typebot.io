import { useTypebot } from '@/features/editor'
import { Text } from '@chakra-ui/react'
import { TagOptions } from 'models'
import { byId } from 'utils'

type TagNodeContentProps = { options: TagOptions }

export default function TagNodeContent({ options }: TagNodeContentProps) {
  return <Text color={'gray.500'}>{'Clique para editar...'}</Text>
}
