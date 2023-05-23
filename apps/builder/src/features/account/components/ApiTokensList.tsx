import { ConfirmModal } from '@/components/ConfirmModal'
import { parseTimeSince } from '@/helpers/parseTimeSince'
import { useToast } from '@/hooks/useToast'
import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { byId, isDefined } from '@typebot.io/lib'
import { User } from '@typebot.io/prisma'
import { useState } from 'react'
import { useApiTokens } from '../hooks/useApiTokens'
import { deleteApiTokenQuery } from '../queries/deleteApiTokenQuery'
import { ApiTokenFromServer } from '../types'
import { CreateTokenModal } from './CreateTokenModal'

type Props = { user: User }

export const ApiTokensList = ({ user }: Props) => {
  const { showToast } = useToast()
  const { apiTokens, isLoading, mutate } = useApiTokens({
    userId: user.id,
    onError: (e) =>
      showToast({ title: 'Falha ao buscar tokens', description: e.message }),
  })
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const [deletingId, setDeletingId] = useState<string>()

  const refreshListWithNewToken = (token: ApiTokenFromServer) => {
    if (!apiTokens) return
    mutate({ apiTokens: [token, ...apiTokens] })
  }

  const deleteToken = async (tokenId?: string) => {
    if (!apiTokens || !tokenId) return
    const { error } = await deleteApiTokenQuery({ userId: user.id, tokenId })
    if (!error) mutate({ apiTokens: apiTokens.filter((t) => t.id !== tokenId) })
  }

  return (
    <Stack spacing={4}>
      <Heading fontSize="2xl">Tokens de API</Heading>
      <Text>
        Esses tokens permitem que outros aplicativos controlem toda a sua conta
        e typebots. Tome cuidado!
      </Text>
      <Flex justifyContent="flex-end">
        <Button onClick={onCreateOpen}>Criar</Button>
        <CreateTokenModal
          userId={user.id}
          isOpen={isCreateOpen}
          onNewToken={refreshListWithNewToken}
          onClose={onCreateClose}
        />
      </Flex>

      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th w="130px">Criado</Th>
              <Th w="0" />
            </Tr>
          </Thead>
          <Tbody>
            {apiTokens?.map((token) => (
              <Tr key={token.id}>
                <Td>{token.name}</Td>
                <Td>{parseTimeSince(token.createdAt)} ago</Td>
                <Td>
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => setDeletingId(token.id)}
                  >
                    Deletar
                  </Button>
                </Td>
              </Tr>
            ))}
            {isLoading &&
              Array.from({ length: 3 }).map((_, idx) => (
                <Tr key={idx}>
                  <Td>
                    <Checkbox isDisabled />
                  </Td>
                  <Td>
                    <Skeleton h="5px" />
                  </Td>
                  <Td>
                    <Skeleton h="5px" />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ConfirmModal
        isOpen={isDefined(deletingId)}
        onConfirm={() => deleteToken(deletingId)}
        onClose={() => setDeletingId(undefined)}
        message={
          <Text>
            O token <strong>{apiTokens?.find(byId(deletingId))?.name}</strong>{' '}
            será excluído permanentemente, tem certeza de que deseja continuar?
          </Text>
        }
        confirmButtonLabel="Deletar"
      />
    </Stack>
  )
}
