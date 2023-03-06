import { TextInput } from '@/components/inputs'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Stack,
} from '@chakra-ui/react'
import { ChatwootOptions } from 'models'
import React from 'react'

type Props = {
  options: ChatwootOptions
  onOptionsChange: (options: ChatwootOptions) => void
}

export const ChatwootSettingsForm = ({ options, onOptionsChange }: Props) => {
  return (
    <Stack spacing={4}>
      <TextInput
        isRequired
        label="Base URL"
        defaultValue={options.baseUrl}
        onChange={(baseUrl: string) => {
          onOptionsChange({ ...options, baseUrl })
        }}
        withVariableButton={false}
      />
      <TextInput
        isRequired
        label="Website token"
        defaultValue={options.websiteToken}
        onChange={(websiteToken) =>
          onOptionsChange({ ...options, websiteToken })
        }
        moreInfoTooltip="Pode ser encontrado no Chatwoot em Configurações > Caixas de entrada > Configurações > Configuração, no trecho de código."
      />
      <Accordion allowMultiple>
        <AccordionItem>
          <AccordionButton justifyContent="space-between">
            Definir detalhes do usuário
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} as={Stack} spacing="4">
            <TextInput
              label="ID"
              defaultValue={options.user?.id}
              onChange={(id: string) => {
                onOptionsChange({ ...options, user: { ...options.user, id } })
              }}
            />
            <TextInput
              label="Nome"
              defaultValue={options.user?.name}
              onChange={(name: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, name },
                })
              }}
            />
            <TextInput
              label="Email"
              defaultValue={options.user?.email}
              onChange={(email: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, email },
                })
              }}
            />
            <TextInput
              label="URL do avatar"
              defaultValue={options.user?.avatarUrl}
              onChange={(avatarUrl: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, avatarUrl },
                })
              }}
            />
            <TextInput
              label="Número de telefone"
              defaultValue={options.user?.phoneNumber}
              onChange={(phoneNumber: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, phoneNumber },
                })
              }}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}
