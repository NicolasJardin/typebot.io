import { FolderPlusIcon } from '@/components/icons'
import { ChangePlanModal } from '@/features/billing/components/ChangePlanModal'
import { LockTag } from '@/features/billing/components/LockTag'
import { isFreePlan } from '@/features/billing/helpers/isFreePlan'
import { LimitReached } from '@/features/billing/types'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { Button, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { Plan } from '@typebot.io/prisma'

type Props = { isLoading: boolean; onClick: () => void }

export const CreateFolderButton = ({ isLoading, onClick }: Props) => {
  const { workspace } = useWorkspace()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleClick = () => {
    if (isFreePlan(workspace)) return onOpen()
    onClick()
  }
  return (
    <Button
      leftIcon={<FolderPlusIcon />}
      onClick={handleClick}
      isLoading={isLoading}
    >
      <HStack>
        <Text>Criar uma pasta</Text>
        {isFreePlan(workspace) && <LockTag plan={Plan.STARTER} />}
      </HStack>
      <ChangePlanModal
        isOpen={isOpen}
        onClose={onClose}
        type={LimitReached.FOLDER}
      />
    </Button>
  )
}
