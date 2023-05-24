import {
  Flex,
  HStack,
  Heading,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const GettingStartedModal = () => {
  const { query } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (query.isFirstBot) onOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody as={Stack} spacing="8" py="10">
          <Stack spacing={4}>
            <Heading fontSize="xl">Informações básicas</Heading>
            <List spacing={4}>
              <HStack as={ListItem}>
                <Flex
                  bgColor="blue.500"
                  rounded="full"
                  boxSize="25px"
                  justify="center"
                  align="center"
                  color="white"
                  fontWeight="bold"
                  flexShrink={0}
                  fontSize="13px"
                >
                  1
                </Flex>
                <Text>
                  A barra lateral esquerda contém blocos que você pode arrastar
                  e soltar para o conselho.
                </Text>
              </HStack>
              <HStack as={ListItem}>
                <Flex
                  bgColor="blue.500"
                  rounded="full"
                  boxSize="25px"
                  fontSize="13px"
                  justify="center"
                  align="center"
                  color="white"
                  fontWeight="bold"
                  flexShrink={0}
                >
                  2
                </Flex>
                <Text>
                  Você pode agrupar blocos soltando-os abaixo ou acima uns aos
                  outros
                </Text>
              </HStack>
              <HStack as={ListItem}>
                <Flex
                  bgColor="blue.500"
                  rounded="full"
                  boxSize="25px"
                  justify="center"
                  align="center"
                  color="white"
                  fontWeight="bold"
                  flexShrink={0}
                  fontSize="13px"
                >
                  3
                </Flex>
                <Text>Conecte os grupos juntos</Text>
              </HStack>
              <HStack as={ListItem}>
                <Flex
                  bgColor="blue.500"
                  rounded="full"
                  boxSize="25px"
                  justify="center"
                  align="center"
                  color="white"
                  fontWeight="bold"
                  flexShrink={0}
                  fontSize="13px"
                >
                  4
                </Flex>
                <Text>
                  Visualize seu bot clicando no botão de visualização na parte
                  superior direita
                </Text>
              </HStack>
            </List>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
