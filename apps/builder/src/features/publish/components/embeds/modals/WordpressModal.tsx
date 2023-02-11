import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Heading,
  ModalCloseButton,
  ModalBody,
  OrderedList,
  ListItem,
  InputGroup,
  Input,
  InputRightElement,
  ModalFooter,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@/components/icons'
import { env, getViewerUrl } from 'utils'
import { ModalProps } from '../EmbedButton'
import { AlertInfo } from '@/components/AlertInfo'
import { CopyButton } from '@/components/CopyButton'

export const WordpressModal = ({
  publicId,
  isPublished,
  isOpen,
  onClose,
}: ModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">WordPress</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isPublished && (
            <AlertInfo mb="2">
              Você precisa publicar seu bot primeiro.
            </AlertInfo>
          )}
          <OrderedList spacing={3}>
            <ListItem>
              Instalar{' '}
              <Link
                href="https://wordpress.org/plugins/typebot/"
                isExternal
                color={useColorModeValue('blue.500', 'blue.300')}
              >
                o plug-in oficial Typebot WordPress
                <ExternalLinkIcon mx="2px" />
              </Link>
            </ListItem>
            <ListItem>
              Copie a URL do seu typebot
              <InputGroup size="md" mt={2}>
                <Input
                  pr="4.5rem"
                  type={'text'}
                  defaultValue={`${
                    env('VIEWER_INTERNAL_URL') ?? getViewerUrl()
                  }/${publicId}`}
                />
                <InputRightElement width="4.5rem">
                  <CopyButton
                    textToCopy={`${
                      env('VIEWER_INTERNAL_URL') ?? getViewerUrl()
                    }/${publicId}`}
                  />
                </InputRightElement>
              </InputGroup>
            </ListItem>
            <ListItem>
              Conclua a configuração na interface do Wordpress
            </ListItem>
          </OrderedList>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  )
}
