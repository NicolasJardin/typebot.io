import { HStack, Tag, Text } from '@chakra-ui/react'
import { RemoveTagOptions } from '@typebot.io/schemas'
import { Fragment } from 'react'

type RemoveTagNodeContentProps = { options: RemoveTagOptions }

export default function RemoveTagNodeContent({
  options,
}: RemoveTagNodeContentProps) {
  return (
    <Fragment>
      {options.name ? (
        <HStack alignItems="center" justifyContent="center">
          <Text>Remover Tag:</Text>

          <Tag
            size="sm"
            sx={{
              minWidth: 1,
              minHeight: 1,
              height: 4,
              width: 4,
            }}
            style={{
              background: options.color,
            }}
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
