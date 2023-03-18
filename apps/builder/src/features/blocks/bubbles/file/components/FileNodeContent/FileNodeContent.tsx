import { Link, Text } from '@chakra-ui/react'
import { FileBubbleContent } from '@typebot.io/schemas/features/blocks/bubbles/file'

type FileNodeContentProps = {
  content: FileBubbleContent
}

export default function FileNodeContent({ content }: FileNodeContentProps) {
  if (content.url)
    return (
      <Link color="Highlight" download href={content.url} target="_blank">
        Arquivo
      </Link>
    )

  return <Text color="gray.500">Escolha um arquivo...</Text>
}
