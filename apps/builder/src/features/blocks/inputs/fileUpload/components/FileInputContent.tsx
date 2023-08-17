import { WithVariableContent } from '@/features/graph/components/nodes/block/WithVariableContent'
import { Text } from '@chakra-ui/react'
import { FileInputOptions } from '@typebot.io/schemas'

type Props = {
  options: FileInputOptions
}

export const FileInputContent = ({
  options: { isMultipleAllowed, variableId },
}: Props) =>
  variableId ? (
    <WithVariableContent variableId={variableId} />
  ) : (
    <Text noOfLines={1} pr="6">
      Coletar {isMultipleAllowed ? 'arquivos' : 'arquivo'}
    </Text>
  )
