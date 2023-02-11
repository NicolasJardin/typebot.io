import { Input } from '@/components/inputs'
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
      <Input
        isRequired
        label="Base URL"
        defaultValue={options.baseUrl}
        onChange={(baseUrl: string) => {
          onOptionsChange({ ...options, baseUrl })
        }}
        withVariableButton={false}
      />
      <Input
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
            <Input
              label="ID"
              defaultValue={options.user?.id}
              onChange={(id: string) => {
                onOptionsChange({ ...options, user: { ...options.user, id } })
              }}
            />
            <Input
              label="Nome"
              defaultValue={options.user?.name}
              onChange={(name: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, name },
                })
              }}
            />
            <Input
              label="Email"
              defaultValue={options.user?.email}
              onChange={(email: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, email },
                })
              }}
            />
            <Input
              label="URL do avatar"
              defaultValue={options.user?.avatarUrl}
              onChange={(avatarUrl: string) => {
                onOptionsChange({
                  ...options,
                  user: { ...options.user, avatarUrl },
                })
              }}
            />
            <Input
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
