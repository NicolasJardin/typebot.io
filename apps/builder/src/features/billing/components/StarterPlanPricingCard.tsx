// @ts-nocheck

import { MoreInfoTooltip } from '@/components/MoreInfoTooltip'
import { ChevronLeftIcon } from '@/components/icons'
import { useScopedI18n } from '@/locales'
import {
  Button,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react'
import { isDefined, parseNumberWithCommas } from '@typebot.io/lib'
import {
  chatsLimit,
  computePrice,
  formatPrice,
  getChatsLimit,
  getStorageLimit,
  storageLimit,
} from '@typebot.io/lib/pricing'
import { Plan } from '@typebot.io/prisma'
import { Workspace } from '@typebot.io/schemas'
import { useEffect, useState } from 'react'
import { FeaturesList } from './FeaturesList'

type Props = {
  workspace: Pick<
    Workspace,
    | 'additionalChatsIndex'
    | 'additionalStorageIndex'
    | 'plan'
    | 'customChatsLimit'
    | 'customStorageLimit'
    | 'stripeId'
  >
  currentSubscription: {
    isYearly?: boolean
  }
  currency?: 'eur' | 'usd'
  isLoading?: boolean
  isYearly: boolean
  onPayClick: (props: {
    selectedChatsLimitIndex: number
    selectedStorageLimitIndex: number
  }) => void
}

export const StarterPlanPricingCard = ({
  workspace,
  currentSubscription,
  isLoading,
  currency,
  isYearly,
  onPayClick,
}: Props) => {
  const scopedT = useScopedI18n('billing.pricingCard')
  const [selectedChatsLimitIndex, setSelectedChatsLimitIndex] =
    useState<number>()
  const [selectedStorageLimitIndex, setSelectedStorageLimitIndex] =
    useState<number>()

  useEffect(() => {
    if (
      isDefined(selectedChatsLimitIndex) ||
      isDefined(selectedStorageLimitIndex)
    )
      return
    if (workspace.plan !== Plan.STARTER) {
      setSelectedChatsLimitIndex(0)
      setSelectedStorageLimitIndex(0)
      return
    }
    setSelectedChatsLimitIndex(workspace.additionalChatsIndex ?? 0)
    setSelectedStorageLimitIndex(workspace.additionalStorageIndex ?? 0)
  }, [
    selectedChatsLimitIndex,
    selectedStorageLimitIndex,
    workspace.additionalChatsIndex,
    workspace.additionalStorageIndex,
    workspace?.plan,
  ])

  const workspaceChatsLimit = workspace ? getChatsLimit(workspace) : undefined
  const workspaceStorageLimit = workspace
    ? getStorageLimit(workspace)
    : undefined

  const isCurrentPlan =
    chatsLimit[Plan.STARTER].graduatedPrice[selectedChatsLimitIndex ?? 0]
      .totalIncluded === workspaceChatsLimit &&
    storageLimit[Plan.STARTER].graduatedPrice[selectedStorageLimitIndex ?? 0]
      .totalIncluded === workspaceStorageLimit &&
    isYearly === currentSubscription?.isYearly

  const getButtonLabel = () => {
    if (
      selectedChatsLimitIndex === undefined ||
      selectedStorageLimitIndex === undefined
    )
      return ''
    if (workspace?.plan === Plan.PRO) return 'Rebaixar'
    if (workspace?.plan === Plan.STARTER) {
      if (isCurrentPlan) return 'Seu plano atual'

      if (
        selectedChatsLimitIndex !== workspace.additionalChatsIndex ||
        selectedStorageLimitIndex !== workspace.additionalStorageIndex ||
        isYearly !== currentSubscription?.isYearly
      )
        return 'Atualizar'
    }
    return 'Melhorar'
  }

  const handlePayClick = async () => {
    if (
      selectedChatsLimitIndex === undefined ||
      selectedStorageLimitIndex === undefined
    )
      return
    onPayClick({
      selectedChatsLimitIndex,
      selectedStorageLimitIndex,
    })
  }

  const price =
    computePrice(
      Plan.STARTER,
      selectedChatsLimitIndex ?? 0,
      selectedStorageLimitIndex ?? 0,
      isYearly ? 'yearly' : 'monthly'
    ) ?? NaN

  return (
    <Stack spacing={6} p="6" rounded="lg" borderWidth="1px" flex="1" h="full">
      <Stack spacing="4">
        <Heading fontSize="2xl">
          Melhorar para <chakra.span color="orange.400">Starter</chakra.span>
        </Heading>
        <Text>Para indivíduos e pequenas empresas.</Text>
        <Heading>
          {formatPrice(
            computePrice(
              Plan.STARTER,
              selectedChatsLimitIndex ?? 0,
              selectedStorageLimitIndex ?? 0
            ) ?? NaN,
            currency
          )}
          <chakra.span fontSize="md">/ mês</chakra.span>
        </Heading>
        <FeaturesList
          features={[
            '2 lugares incluídos',
            <HStack key="test">
              <Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronLeftIcon transform="rotate(-90deg)" />}
                    size="sm"
                    isLoading={selectedChatsLimitIndex === undefined}
                  >
                    {selectedChatsLimitIndex !== undefined
                      ? parseNumberWithCommas(
                          chatsLimit.STARTER.graduatedPrice[
                            selectedChatsLimitIndex
                          ].totalIncluded
                        )
                      : undefined}
                  </MenuButton>
                  <MenuList>
                    {chatsLimit.STARTER.graduatedPrice.map((price, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => setSelectedChatsLimitIndex(index)}
                      >
                        {parseNumberWithCommas(price.totalIncluded)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>{' '}
                {scopedT('chatsPerMonth')}
              </Text>
              <MoreInfoTooltip>
                Um bate-papo é contado sempre que um usuário inicia uma
                discussão. Isso é independente do número de mensagens que envia
                e recebe.
              </MoreInfoTooltip>
            </HStack>,
            <HStack key="test">
              <Text>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronLeftIcon transform="rotate(-90deg)" />}
                    size="sm"
                    isLoading={selectedStorageLimitIndex === undefined}
                  >
                    {selectedStorageLimitIndex !== undefined
                      ? parseNumberWithCommas(
                          storageLimit.STARTER.graduatedPrice[
                            selectedStorageLimitIndex
                          ].totalIncluded
                        )
                      : undefined}
                  </MenuButton>
                  <MenuList>
                    {storageLimit.STARTER.graduatedPrice.map((price, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => setSelectedStorageLimitIndex(index)}
                      >
                        {parseNumberWithCommas(price.totalIncluded)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>{' '}
                GB de armazenamento
              </Text>
              <MoreInfoTooltip>
                Você acumula armazenamento para cada arquivo que seu usuário
                carrega seu robô. Se você excluir o resultado, ele liberará
                espaço.
              </MoreInfoTooltip>
            </HStack>,
            'Marca removida',
            'Bloco de entrada de upload de arquivo',
            'Criar pastas',
          ]}
        />
      </Stack>
      <Stack>
        {isYearly && workspace.stripeId && !isCurrentPlan && (
          <Heading mt="0" fontSize="md">
            You pay: {formatPrice(price * 12, currency)} / year
          </Heading>
        )}
        <Button
          colorScheme="orange"
          variant="outline"
          onClick={handlePayClick}
          isLoading={isLoading}
          isDisabled={isCurrentPlan}
        >
          {getButtonLabel()}
        </Button>
      </Stack>
    </Stack>
  )
}
