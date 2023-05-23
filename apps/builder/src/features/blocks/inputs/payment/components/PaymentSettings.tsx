import {
  Stack,
  useDisclosure,
  Text,
  Select,
  HStack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react'
import { DropdownList } from '@/components/DropdownList'
import {
  PaymentAddress,
  PaymentInputOptions,
  PaymentProvider,
} from '@typebot.io/schemas'
import React, { ChangeEvent } from 'react'
import { currencies } from '../currencies'
import { StripeConfigModal } from './StripeConfigModal'
import { CredentialsDropdown } from '@/features/credentials/components/CredentialsDropdown'
import { TextInput } from '@/components/inputs'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { PaymentAddressSettings } from './PaymentAddressSettings'

type Props = {
  options: PaymentInputOptions
  onOptionsChange: (options: PaymentInputOptions) => void
}

export const PaymentSettings = ({ options, onOptionsChange }: Props) => {
  const { workspace } = useWorkspace()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const updateProvider = (provider: PaymentProvider) => {
    onOptionsChange({
      ...options,
      provider,
    })
  }

  const updateCredentials = (credentialsId?: string) => {
    onOptionsChange({
      ...options,
      credentialsId,
    })
  }

  const updateAmount = (amount?: string) =>
    onOptionsChange({
      ...options,
      amount,
    })

  const updateCurrency = (e: ChangeEvent<HTMLSelectElement>) =>
    onOptionsChange({
      ...options,
      currency: e.target.value,
    })

  const updateName = (name: string) =>
    onOptionsChange({
      ...options,
      additionalInformation: { ...options.additionalInformation, name },
    })

  const updateEmail = (email: string) =>
    onOptionsChange({
      ...options,
      additionalInformation: { ...options.additionalInformation, email },
    })

  const updatePhoneNumber = (phoneNumber: string) =>
    onOptionsChange({
      ...options,
      additionalInformation: { ...options.additionalInformation, phoneNumber },
    })

  const updateButtonLabel = (button: string) =>
    onOptionsChange({
      ...options,
      labels: { ...options.labels, button },
    })

  const updateSuccessLabel = (success: string) =>
    onOptionsChange({
      ...options,
      labels: { ...options.labels, success },
    })

  const updateDescription = (description: string) =>
    onOptionsChange({
      ...options,
      additionalInformation: { ...options.additionalInformation, description },
    })

  const updateAddress = (address: PaymentAddress) =>
    onOptionsChange({
      ...options,
      additionalInformation: { ...options.additionalInformation, address },
    })

  return (
    <Stack spacing={4}>
      <Stack>
        <Text>Fornecedor:</Text>
        <DropdownList
          onItemSelect={updateProvider}
          items={Object.values(PaymentProvider)}
          currentItem={options.provider}
        />
      </Stack>
      <Stack>
        <Text>Conta:</Text>
        {workspace && (
          <CredentialsDropdown
            type="stripe"
            workspaceId={workspace.id}
            currentCredentialsId={options.credentialsId}
            onCredentialsSelect={updateCredentials}
            onCreateNewClick={onOpen}
          />
        )}
      </Stack>
      <HStack>
        <TextInput
          label="Valor:"
          onChange={updateAmount}
          defaultValue={options.amount ?? ''}
          placeholder="30.00"
        />
        <Stack>
          <Text>Moeda:</Text>
          <Select
            placeholder="Selecione uma opção"
            value={options.currency}
            onChange={updateCurrency}
          >
            {currencies.map((currency) => (
              <option value={currency.code} key={currency.code}>
                {currency.code}
              </option>
            ))}
          </Select>
        </Stack>
      </HStack>
      <TextInput
        label="Rótulo do botão:"
        onChange={updateButtonLabel}
        defaultValue={options.labels.button}
        placeholder="Pagar"
      />
      <TextInput
        label="Mensagem de sucesso:"
        onChange={updateSuccessLabel}
        defaultValue={options.labels.success ?? 'Sucesso'}
        placeholder="Sucesso"
      />
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton justifyContent="space-between">
            Informações adicionais
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py={4} as={Stack} spacing="6">
            <TextInput
              label="Description:"
              defaultValue={options.additionalInformation?.description ?? ''}
              onChange={updateDescription}
              placeholder="A digital product"
            />
            <TextInput
              label="Nome:"
              defaultValue={options.additionalInformation?.name ?? ''}
              onChange={updateName}
              placeholder="John Smith"
            />
            <TextInput
              label="Email:"
              defaultValue={options.additionalInformation?.email ?? ''}
              onChange={updateEmail}
              placeholder="john@gmail.com"
            />
            <TextInput
              label="Número de telefone:"
              defaultValue={options.additionalInformation?.phoneNumber ?? ''}
              onChange={updatePhoneNumber}
              placeholder="+33XXXXXXXXX"
            />
            <PaymentAddressSettings
              address={options.additionalInformation?.address}
              onAddressChange={updateAddress}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <StripeConfigModal
        isOpen={isOpen}
        onClose={onClose}
        onNewCredentials={updateCredentials}
      />
    </Stack>
  )
}
