import { MenuList, MenuItem } from '@chakra-ui/react'
import { CopyIcon, TrashIcon } from '@/components/icons'
import { useTypebot } from '@/features/editor'
import { BlockIndices } from 'models'

type Props = { indices: BlockIndices }
export const BlockNodeContextMenu = ({ indices }: Props) => {
  const { deleteBlock, duplicateBlock } = useTypebot()

  const handleDuplicateClick = () => duplicateBlock(indices)

  const handleDeleteClick = () => deleteBlock(indices)

  return (
    <MenuList>
      <MenuItem icon={<CopyIcon />} onClick={handleDuplicateClick}>
        Duplicar
      </MenuItem>
      <MenuItem icon={<TrashIcon />} onClick={handleDeleteClick}>
        Deletar
      </MenuItem>
    </MenuList>
  )
}
