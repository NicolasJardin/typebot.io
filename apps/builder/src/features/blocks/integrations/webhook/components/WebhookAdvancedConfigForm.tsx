import { DropdownList } from '@/components/DropdownList'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { TableList, TableListItemProps } from '@/components/TableList'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useToast } from '@/hooks/useToast'
import {
  Stack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Text,
} from '@chakra-ui/react'
import {
  HttpMethod,
  KeyValue,
  VariableForTest,
  ResponseVariableMapping,
  WebhookOptions,
  Webhook,
} from '@typebot.io/schemas'
import { useState, useMemo } from 'react'
import { executeWebhook } from '../queries/executeWebhookQuery'
import { convertVariablesForTestToVariables } from '../helpers/convertVariablesForTestToVariables'
import { getDeepKeys } from '../helpers/getDeepKeys'
import { QueryParamsInputs, HeadersInputs } from './KeyValueInputs'
import { DataVariableInputs } from './ResponseMappingInputs'
import { VariableForTestInputs } from './VariableForTestInputs'
import { SwitchWithRelatedSettings } from '@/components/SwitchWithRelatedSettings'

type Props = {
  blockId: string
  webhook: Webhook
  options: WebhookOptions
  onWebhookChange: (webhook: Webhook) => void
  onOptionsChange: (options: WebhookOptions) => void
}

export const WebhookAdvancedConfigForm = ({
  blockId,
  webhook,
  options,
  onWebhookChange,
  onOptionsChange,
}: Props) => {
  const { typebot, save, updateWebhook } = useTypebot()
  const [isTestResponseLoading, setIsTestResponseLoading] = useState(false)
  const [testResponse, setTestResponse] = useState<string>()
  const [responseKeys, setResponseKeys] = useState<string[]>([])
  const { showToast } = useToast()

  const updateMethod = (method: HttpMethod) =>
    onWebhookChange({ ...webhook, method })

  const updateQueryParams = (queryParams: KeyValue[]) =>
    onWebhookChange({ ...webhook, queryParams })

  const updateHeaders = (headers: KeyValue[]) =>
    onWebhookChange({ ...webhook, headers })

  const updateBody = (body: string) => onWebhookChange({ ...webhook, body })

  const updateVariablesForTest = (variablesForTest: VariableForTest[]) =>
    onOptionsChange({ ...options, variablesForTest })

  const updateResponseVariableMapping = (
    responseVariableMapping: ResponseVariableMapping[]
  ) => onOptionsChange({ ...options, responseVariableMapping })

  const updateAdvancedConfig = (isAdvancedConfig: boolean) =>
    onOptionsChange({ ...options, isAdvancedConfig })

  const updateIsCustomBody = (isCustomBody: boolean) =>
    onOptionsChange({ ...options, isCustomBody })

  const executeTestRequest = async () => {
    if (!typebot || !webhook) return
    setIsTestResponseLoading(true)
    await Promise.all([updateWebhook(webhook.id, webhook), save()])
    const { data, error } = await executeWebhook(
      typebot.id,
      convertVariablesForTestToVariables(
        options.variablesForTest,
        typebot.variables
      ),
      { blockId }
    )
    if (error)
      return showToast({ title: error.name, description: error.message })
    setTestResponse(JSON.stringify(data, undefined, 2))
    setResponseKeys(getDeepKeys(data))
    setIsTestResponseLoading(false)
  }

  const updateIsExecutedOnClient = (isExecutedOnClient: boolean) =>
    onOptionsChange({ ...options, isExecutedOnClient })

  const ResponseMappingInputs = useMemo(
    () =>
      function Component(props: TableListItemProps<ResponseVariableMapping>) {
        return <DataVariableInputs {...props} dataItems={responseKeys} />
      },
    [responseKeys]
  )

  return (
    <>
      <SwitchWithRelatedSettings
        label="Configurações avançadas"
        initialValue={options.isAdvancedConfig ?? true}
        onCheckChange={updateAdvancedConfig}
      >
        <SwitchWithLabel
          label="Executar no cliente"
          moreInfoContent="Se ativado, o webhook será executado no cliente. Isso significa que será executado no navegador do seu visitante. Certifique-se de ativar o CORS e não exponha dados confidenciais."
          initialValue={options.isExecutedOnClient ?? false}
          onCheckChange={updateIsExecutedOnClient}
        />
        <HStack justify="space-between">
          <Text>Método:</Text>
          <DropdownList
            currentItem={webhook.method as HttpMethod}
            onItemSelect={updateMethod}
            items={Object.values(HttpMethod)}
          />
        </HStack>
        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Parâmetros de consulta
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<KeyValue>
                initialItems={webhook.queryParams}
                onItemsChange={updateQueryParams}
                Item={QueryParamsInputs}
                addLabel="Adicionar um parâmetro"
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Headers
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<KeyValue>
                initialItems={webhook.headers}
                onItemsChange={updateHeaders}
                Item={HeadersInputs}
                addLabel="Adicionar um valor"
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Body
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel py={4} as={Stack} spacing="6">
              <SwitchWithLabel
                label="Body customizado"
                initialValue={options.isCustomBody ?? true}
                onCheckChange={updateIsCustomBody}
              />
              {(options.isCustomBody ?? true) && (
                <CodeEditor
                  defaultValue={webhook.body ?? ''}
                  lang="json"
                  onChange={updateBody}
                  debounceTimeout={0}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Valores variáveis para teste
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<VariableForTest>
                initialItems={
                  options?.variablesForTest ?? { byId: {}, allIds: [] }
                }
                onItemsChange={updateVariablesForTest}
                Item={VariableForTestInputs}
                addLabel="Adicionar uma entrada"
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </SwitchWithRelatedSettings>
      {webhook.url && (
        <Button
          onClick={executeTestRequest}
          colorScheme="blue"
          isLoading={isTestResponseLoading}
        >
          Teste a solicitação
        </Button>
      )}
      {testResponse && (
        <CodeEditor isReadOnly lang="json" value={testResponse} />
      )}
      {(testResponse || options.responseVariableMapping.length > 0) && (
        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              Save in variables
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<ResponseVariableMapping>
                initialItems={options.responseVariableMapping}
                onItemsChange={updateResponseVariableMapping}
                Item={ResponseMappingInputs}
                addLabel="Adicionar uma entrada"
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
    </>
  )
}
