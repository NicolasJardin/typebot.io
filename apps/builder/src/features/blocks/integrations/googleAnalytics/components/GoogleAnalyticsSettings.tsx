import { NumberInput, TextInput } from '@/components/inputs'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Stack,
} from '@chakra-ui/react'
import { GoogleAnalyticsOptions } from '@typebot.io/schemas'

type Props = {
  options?: GoogleAnalyticsOptions
  onOptionsChange: (options: GoogleAnalyticsOptions) => void
}

export const GoogleAnalyticsSettings = ({
  options,
  onOptionsChange,
}: Props) => {
  const updateTrackingId = (trackingId: string) =>
    onOptionsChange({ ...options, trackingId })

  const updateCategory = (category: string) =>
    onOptionsChange({ ...options, category })

  const updateAction = (action: string) =>
    onOptionsChange({ ...options, action })

  const updateLabel = (label: string) => onOptionsChange({ ...options, label })

  const updateValue = (value: number | `{{${string}}}` | undefined) =>
    onOptionsChange({
      ...options,
      value,
    })

  const updateSendTo = (sendTo?: string) =>
    onOptionsChange({
      ...options,
      sendTo,
    })

  return (
    <Stack spacing={4}>
      <TextInput
        label="ID de rastreamento:"
        moreInfoTooltip="Pode ser encontrado clicando em seu fluxo de dados no painel do Google Analytics."
        defaultValue={options?.trackingId ?? ''}
        placeholder="G-123456..."
        onChange={updateTrackingId}
      />
      <TextInput
        label="Ação do evento:"
        defaultValue={options?.action ?? ''}
        placeholder="Example: Conversão"
        onChange={updateAction}
      />
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Avançado
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} as={Stack} spacing="6">
            <TextInput
              label="Categoria do evento:"
              defaultValue={options?.category ?? ''}
              placeholder="Example: Fluxo"
              onChange={updateCategory}
            />
            <TextInput
              label="Rótulo do evento::"
              defaultValue={options?.label ?? ''}
              placeholder="Examplo: Campanha Z"
              onChange={updateLabel}
            />
            <NumberInput
              direction="column"
              label="Valor do evento:"
              defaultValue={options?.value}
              placeholder="Examplo: 0"
              onValueChange={updateValue}
            />
            <TextInput
              label="Enviar para:"
              moreInfoTooltip="Útil para enviar um evento de conversão para o Google Ads"
              defaultValue={options?.sendTo?.toString() ?? ''}
              placeholder="Examplo: AW-123456789"
              onChange={updateSendTo}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}
