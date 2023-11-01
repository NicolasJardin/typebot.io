import { AlertInfo } from '@/components/AlertInfo'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { ChangePlanForm } from './ChangePlanForm'

export type ChangePlanModalProps = {
  type?: string
  isOpen: boolean
  excludedPlans?: ('STARTER' | 'PRO')[]
  onClose: () => void
}

export const ChangePlanModal = ({
  onClose,
  isOpen,
  type,
  excludedPlans,
}: ChangePlanModalProps) => {
  const { workspace } = useWorkspace()
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={excludedPlans ? 'lg' : '2xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody as={Stack} spacing="6" pt="10">
          {type && (
            <AlertInfo>Você precisa atualizar seu plano para {type}</AlertInfo>
          )}
          {workspace && (
            <ChangePlanForm
              workspace={workspace}
              excludedPlans={excludedPlans}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button colorScheme="gray" onClick={onClose}>
              Cancelar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
