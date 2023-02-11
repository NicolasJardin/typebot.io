import { HStack, Text, Tooltip } from '@chakra-ui/react'
import { useWorkspace } from '@/features/workspace'
import { Plan } from 'db'
import {
  BubbleBlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
  BlockType,
} from 'models'
import React from 'react'
import { isFreePlan, LockTag } from '@/features/billing'

type Props = { type: BlockType }

export const BlockTypeLabel = ({ type }: Props): JSX.Element => {
  const { workspace } = useWorkspace()

  switch (type) {
    case 'start':
      return <Text>Início</Text>
    case BubbleBlockType.TEXT:
    case InputBlockType.TEXT:
      return <Text>Texto</Text>
    case BubbleBlockType.IMAGE:
      return <Text>Imagem</Text>
    case BubbleBlockType.VIDEO:
      return <Text>Video</Text>
    case BubbleBlockType.EMBED:
      return (
        <Tooltip label="Incorpore um pdf, um iframe, um site...">
          <Text>Embutir</Text>
        </Tooltip>
      )
    case BubbleBlockType.AUDIO:
      return <Text>Audio</Text>
    case InputBlockType.NUMBER:
      return <Text>Número</Text>
    case InputBlockType.EMAIL:
      return <Text>Email</Text>
    case InputBlockType.URL:
      return <Text>Website</Text>
    case InputBlockType.DATE:
      return <Text>Data</Text>
    case InputBlockType.PHONE:
      return <Text>Telefone</Text>
    case InputBlockType.CHOICE:
      return <Text>Botão</Text>
    case InputBlockType.PAYMENT:
      return <Text>Pagamento</Text>
    case InputBlockType.RATING:
      return <Text>Avaliação</Text>
    case InputBlockType.FILE:
      return (
        <Tooltip label="Upload Files">
          <HStack>
            <Text>Arquivo</Text>
            {isFreePlan(workspace) && <LockTag plan={Plan.STARTER} />}
          </HStack>
        </Tooltip>
      )
    case LogicBlockType.SET_VARIABLE:
      return <Text>Variável</Text>
    case LogicBlockType.CONDITION:
      return <Text>Condição</Text>
    case LogicBlockType.REDIRECT:
      return <Text>Redirecionar</Text>
    case LogicBlockType.SCRIPT:
      return (
        <Tooltip label="Executar código Javascript">
          <Text>Script</Text>
        </Tooltip>
      )
    case LogicBlockType.TYPEBOT_LINK:
      return (
        <Tooltip label="Link para outro dos seus typebots">
          <Text>Typebot</Text>
        </Tooltip>
      )
    case LogicBlockType.WAIT:
      return <Text>Esperar</Text>
    case LogicBlockType.TRANSFER:
      return <Text>Transferência</Text>
    case IntegrationBlockType.GOOGLE_SHEETS:
      return (
        <Tooltip label="Planilhas Google">
          <Text>Planilhas</Text>
        </Tooltip>
      )
    case IntegrationBlockType.GOOGLE_ANALYTICS:
      return (
        <Tooltip label="Google Analytics">
          <Text>Análise</Text>
        </Tooltip>
      )
    case IntegrationBlockType.WEBHOOK:
      return <Text>Webhook</Text>
    case IntegrationBlockType.ZAPIER:
      return <Text>Zapier</Text>
    case IntegrationBlockType.MAKE_COM:
      return <Text>Make.com</Text>
    case IntegrationBlockType.PABBLY_CONNECT:
      return <Text>Pabbly</Text>
    case IntegrationBlockType.EMAIL:
      return <Text>Email</Text>
    case IntegrationBlockType.CHATWOOT:
      return <Text>Chatwoot</Text>
  }
}
