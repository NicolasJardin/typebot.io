import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Text,
  Image,
  Button,
  ModalFooter,
  Flex,
} from '@chakra-ui/react'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import Link from 'next/link'
import React from 'react'
import { AlertInfo } from '@/components/AlertInfo'
import { GoogleLogo } from '@/components/GoogleLogo'
import { getGoogleSheetsConsentScreenUrlQuery } from '../queries/getGoogleSheetsConsentScreenUrlQuery'

type Props = {
  isOpen: boolean
  blockId: string
  onClose: () => void
}

export const GoogleSheetConnectModal = ({
  blockId,
  isOpen,
  onClose,
}: Props) => {
  const { workspace } = useWorkspace()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Conectar planilhas</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={Stack} spacing="6">
          <AlertInfo>
            O Automações.pro precisa acessar o Google Drive para listar todas as
            suas planilhas. Ele também precisa acessar suas planilhas para
            buscar ou injetar dados nele.
          </AlertInfo>
          <Text>
            Certifique-se de verificar todas as permissões para que a integração
            funcione como esperado:
          </Text>
          <Image
            src="/images/google-spreadsheets-scopes.jpeg"
            alt="Google Spreadsheets checkboxes"
            rounded="md"
          />
          <Flex>
            <Button
              as={Link}
              leftIcon={<GoogleLogo />}
              data-testid="google"
              isLoading={['loading', 'authenticated'].includes(status)}
              variant="outline"
              href={getGoogleSheetsConsentScreenUrlQuery(
                window.location.href,
                blockId,
                workspace?.id
              )}
              mx="auto"
            >
              Continuar com o Google
            </Button>
          </Flex>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}
