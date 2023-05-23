import { AlertInfo } from '@/components/AlertInfo'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { useI18n } from '@/locales'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Button,
  HStack,
} from '@chakra-ui/react'
import { ChangePlanForm } from './ChangePlanForm'

type ChangePlanModalProps = {
  type?: string
  isOpen: boolean
  onClose: () => void
}

export const ChangePlanModal = ({
  onClose,
  isOpen,
  type,
}: ChangePlanModalProps) => {
  const t = useI18n()
  const { workspace, refreshWorkspace } = useWorkspace()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody as={Stack} spacing="6" pt="10">
          {type && (
            <AlertInfo>Você precisa atualizar seu plano para {type}</AlertInfo>
          )}
          {workspace && (
            <ChangePlanForm
              workspace={workspace}
              onUpgradeSuccess={refreshWorkspace}
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
