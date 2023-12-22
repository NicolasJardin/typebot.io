import { Text, Tooltip } from '@chakra-ui/react'
import {
  BlockType,
  InputBlockType,
  IntegrationBlockType,
  LogicBlockType,
} from '@typebot.io/schemas'
import { BubbleBlockType } from '@typebot.io/schemas/features/blocks/bubbles/enums'

type Props = { type: BlockType }

export const BlockLabel = ({ type }: Props): JSX.Element => {
  switch (type) {
    case 'start':
      return <Text>Início</Text>
    case BubbleBlockType.TEXT:
    case InputBlockType.TEXT:
      return <Text>Resposta</Text>
    case BubbleBlockType.IMAGE:
      return <Text>Imagem</Text>
    case BubbleBlockType.VIDEO:
      return <Text fontSize="sm">Video</Text>
    case BubbleBlockType.EMBED:
      return (
        <Tooltip label="Incorpore um pdf, um iframe, um site...">
          <Text>Embutir</Text>
        </Tooltip>
      )
    case BubbleBlockType.AUDIO:
      return <Text>Audio</Text>
    case BubbleBlockType.FILE:
      return <Text>Arquivo</Text>
    case BubbleBlockType.BUTTON:
      return <Text>Botão</Text>
    case InputBlockType.NUMBER:
      return <Text>Número</Text>
    case InputBlockType.EMAIL:
      return <Text fontSize="sm">Email</Text>
    case InputBlockType.URL:
      return <Text fontSize="sm">Website</Text>
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
      return <Text>Arquivo</Text>
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
        <Tooltip label="Link para outro dos seus fluxos">
          <Text>Fluxo</Text>
        </Tooltip>
      )
    case LogicBlockType.WAIT:
      return <Text>Digitando</Text>
    case LogicBlockType.TRANSFER:
      return <Text>Transferir</Text>
    case LogicBlockType.SPREAD:
      return <Text>Distribuir</Text>
    case LogicBlockType.TAG:
      return <Text>Criar tag</Text>
    case LogicBlockType.REMOVE_TAG:
      return <Text>Remover tag</Text>
    case LogicBlockType.END:
      return <Text>Fim</Text>
    case LogicBlockType.JUMP:
      return <Text>Pular</Text>
    case LogicBlockType.TEMPLATE:
      return <Text>Modelo</Text>
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

    case InputBlockType.PICTURE_CHOICE:
      return <Text fontSize="sm">Escolher foto</Text>

    case LogicBlockType.AB_TEST:
      return <Text fontSize="sm">Teste AB</Text>

    case IntegrationBlockType.WEBHOOK:
      return <Text fontSize="sm">Webhook</Text>

    case IntegrationBlockType.EMAIL:
      return <Text fontSize="sm">Email</Text>
    // case IntegrationBlockType.ZAPIER:
    //   return <Text fontSize="sm">Zapier</Text>
    // case IntegrationBlockType.MAKE_COM:
    //   return <Text fontSize="sm">Make.com</Text>
    // case IntegrationBlockType.PABBLY_CONNECT:
    //   return <Text fontSize="sm">Pabbly</Text>

    // case IntegrationBlockType.CHATWOOT:
    //   return <Text fontSize="sm">Chatwoot</Text>
    // case IntegrationBlockType.OPEN_AI:
    //   return <Text fontSize="sm">OpenAI</Text>
    // case IntegrationBlockType.PIXEL:
    //   return <Text fontSize="sm">Pixel</Text>
  }

  return <Text>Aguardar</Text>
}
