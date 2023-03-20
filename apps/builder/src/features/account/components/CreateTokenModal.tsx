import { CopyButton } from '@/components/CopyButton'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Input,
  ModalFooter,
  Button,
  Text,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import React, { FormEvent, useState } from 'react'
import { createApiTokenQuery } from '../queries/createApiTokenQuery'
import { ApiTokenFromServer } from '../types'

type Props = {
  userId: string
  isOpen: boolean
  onNewToken: (token: ApiTokenFromServer) => void
  onClose: () => void
}

export const CreateTokenModal = ({
  userId,
  isOpen,
  onClose,
  onNewToken,
}: Props) => {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTokenValue, setNewTokenValue] = useState<string>()

  const createToken = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const { data } = await createApiTokenQuery(userId, { name })
    if (data?.apiToken) {
      setNewTokenValue(data.apiToken.token)
      onNewToken(data.apiToken)
    }
    setIsSubmitting(false)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {newTokenValue ? 'Token criado' : 'Criar Token'}
        </ModalHeader>
        <ModalCloseButton />
        {newTokenValue ? (
          <ModalBody as={Stack} spacing="4">
            <Text>
              Copie seu token e guarde-o em um local seguro.{' '}
              <strong>
                Por motivos de segurança, não podemos mostrá-lo novamente.
              </strong>
            </Text>
            <InputGroup size="md">
              <Input readOnly pr="4.5rem" value={newTokenValue} />
              <InputRightElement width="4.5rem">
                <CopyButton h="1.75rem" size="sm" textToCopy={newTokenValue} />
              </InputRightElement>
            </InputGroup>
          </ModalBody>
        ) : (
          <ModalBody as="form" onSubmit={createToken}>
            <Text mb="4">
              Insira um nome exclusivo para seu token para diferenciá-lo de
              outros tokens.
            </Text>
            <Input
              placeholder="Ex: Zapier, Github, Make.com"
              onChange={(e) => setName(e.target.value)}
            />
          </ModalBody>
        )}

        <ModalFooter>
          {newTokenValue ? (
            <Button onClick={onClose} colorScheme="blue">
              Done
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              isDisabled={name.length === 0}
              isLoading={isSubmitting}
              onClick={createToken}
            >
              Create token
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
