import { Text } from '@chakra-ui/react'
import { RatingInputBlock } from 'models'

type Props = {
  block: RatingInputBlock
}

export const RatingInputContent = ({ block }: Props) => (
  <Text noOfLines={1} pr="6">
    Avalie de {block.options.buttonType === 'Icones' ? 1 : 0} a{' '}
    {block.options.length}
  </Text>
)
