import { ChevronLeftIcon } from '@/components/icons'
import { Button } from '@chakra-ui/react'
import Link from 'next/link'
import { useMemo } from 'react'
import { useTypebotDnd } from '../TypebotDndProvider'

export const BackButton = ({ id }: { id: string | null }) => {
  const { draggedTypebot, setMouseOverFolderId, mouseOverFolderId } =
    useTypebotDnd()

  const isTypebotOver = useMemo(
    () => draggedTypebot && mouseOverFolderId === id,
    [draggedTypebot, id, mouseOverFolderId]
  )

  const handleMouseEnter = () => setMouseOverFolderId(id)
  const handleMouseLeave = () => setMouseOverFolderId(undefined)
  return (
    <Button
      as={Link}
      href={id ? `/typebots/folders/${id}` : '/typebots'}
      leftIcon={<ChevronLeftIcon />}
      variant={'outline'}
      colorScheme={isTypebotOver ? 'blue' : 'gray'}
      borderWidth={isTypebotOver ? '3px' : '1px'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Voltar
    </Button>
  )
}
