import { AlertInfo } from '@/components/AlertInfo'
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

export enum LimitReached {
  BRAND = 'remover marca',
  CUSTOM_DOMAIN = 'adicionar domínios personalizados',
  FOLDER = 'criar pastas',
  FILE_INPUT = 'usar blocos de entrada de arquivo',
  ANALYTICS = 'desbloquear análises detalhadas',
}

type ChangePlanModalProps = {
  type?: LimitReached
  isOpen: boolean
  onClose: () => void
}

export const ChangePlanModal = ({
  onClose,
  isOpen,
  type,
}: ChangePlanModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody as={Stack} spacing="6" pt="10">
          {type && (
            <AlertInfo>Você precisa atualizar seu plano para {type}</AlertInfo>
          )}
          <ChangePlanForm />
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
