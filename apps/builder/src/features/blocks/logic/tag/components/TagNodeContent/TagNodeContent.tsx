import { useTypebot } from '@/features/editor'
import { Text } from '@chakra-ui/react'
import { TagOptions } from 'models'
import { byId } from 'utils'

type TagNodeContentProps = { options: TagOptions }

export default function TagNodeContent({ options }: TagNodeContentProps) {
  const { typebot } = useTypebot()

  const variableName = typebot?.tags.find(byId(options.id))?.name

  return (
    <Text color={'gray.500'}>{variableName || 'Clique para editar...'}</Text>
  )
}
