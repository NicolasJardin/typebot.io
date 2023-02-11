import {
  Stack,
  Flex,
  Heading,
  Progress,
  Text,
  Skeleton,
  HStack,
  Tooltip,
} from '@chakra-ui/react'
import { AlertIcon } from '@/components/icons'
import { Plan, Workspace } from 'db'
import React from 'react'
import { parseNumberWithCommas } from 'utils'
import { getChatsLimit, getStorageLimit } from 'utils/pricing'
import { storageToReadable } from './helpers'
import { useUsage } from '../../../hooks/useUsage'

type Props = {
  workspace: Workspace
}

export const UsageContent = ({ workspace }: Props) => {
  const { data, isLoading } = useUsage(workspace.id)
  const totalChatsUsed = data?.totalChatsUsed ?? 0
  const totalStorageUsed = data?.totalStorageUsed ?? 0

  const workspaceChatsLimit = getChatsLimit(workspace)
  const workspaceStorageLimit = getStorageLimit(workspace)
  const workspaceStorageLimitGigabites =
    workspaceStorageLimit * 1024 * 1024 * 1024

  const chatsPercentage = Math.round(
    (totalChatsUsed / workspaceChatsLimit) * 100
  )
  const storagePercentage = Math.round(
    (totalStorageUsed / workspaceStorageLimitGigabites) * 100
  )

  return (
    <Stack spacing={6}>
      <Heading fontSize="3xl">Usage</Heading>
      <Stack spacing={3}>
        <Flex justifyContent="space-between">
          <HStack>
            <Heading fontSize="xl" as="h3">
              Bate-papos
            </Heading>
            {chatsPercentage >= 80 && (
              <Tooltip
                placement="top"
                rounded="md"
                p="3"
                label={
                  <Text>
                    Seus typebots são populares! Em breve você alcançará seu
                    limite de chats de seu plano. 🚀
                    <br />
                    <br />
                    Certifique-se de <strong>atualizar seu plano</strong> para
                    aumentar esse limite e continuar conversando com seus
                    usuários.
                  </Text>
                }
              >
                <span>
                  <AlertIcon color="orange.500" />
                </span>
              </Tooltip>
            )}
            <Text fontSize="sm" fontStyle="italic" color="gray.500">
              (reinicia no dia 1º de cada mês)
            </Text>
          </HStack>

          <HStack>
            <Skeleton
              fontWeight="bold"
              isLoaded={!isLoading}
              h={isLoading ? '5px' : 'auto'}
            >
              {parseNumberWithCommas(totalChatsUsed)}
            </Skeleton>
            <Text>
              /{' '}
              {workspaceChatsLimit === -1
                ? 'Ilimitado'
                : parseNumberWithCommas(workspaceChatsLimit)}
            </Text>
          </HStack>
        </Flex>

        <Progress
          h="5px"
          value={chatsPercentage}
          rounded="full"
          hasStripe
          isIndeterminate={isLoading}
          colorScheme={totalChatsUsed >= workspaceChatsLimit ? 'red' : 'blue'}
        />
      </Stack>
      {workspace.plan !== Plan.FREE && (
        <Stack spacing={3}>
          <Flex justifyContent="space-between">
            <HStack>
              <Heading fontSize="xl" as="h3">
                Armazenamento
              </Heading>
              {storagePercentage >= 80 && (
                <Tooltip
                  placement="top"
                  rounded="md"
                  p="3"
                  label={
                    <Text>
                      Seus typebots são populares! Em breve você alcançará seu
                      limite de armazenamento de seu plano. 🚀
                      <br />
                      <br />
                      Certifique-se de <strong>atualizar seu plano</strong> para
                      continuar coletando arquivos enviados. Você também pode{' '}
                      <strong>excluir arquivos</strong> para liberar espaço.
                    </Text>
                  }
                >
                  <span>
                    <AlertIcon color="orange.500" />
                  </span>
                </Tooltip>
              )}
            </HStack>
            <HStack>
              <Skeleton
                fontWeight="bold"
                isLoaded={!isLoading}
                h={isLoading ? '5px' : 'auto'}
              >
                {storageToReadable(totalStorageUsed)}
              </Skeleton>
              <Text>
                /{' '}
                {workspaceStorageLimit === -1
                  ? 'Ilimitado'
                  : `${workspaceStorageLimit} GB`}
              </Text>
            </HStack>
          </Flex>
          <Progress
            value={storagePercentage}
            h="5px"
            colorScheme={
              totalStorageUsed >= workspaceStorageLimitGigabites
                ? 'red'
                : 'blue'
            }
            rounded="full"
            hasStripe
            isIndeterminate={isLoading}
          />
        </Stack>
      )}
    </Stack>
  )
}
