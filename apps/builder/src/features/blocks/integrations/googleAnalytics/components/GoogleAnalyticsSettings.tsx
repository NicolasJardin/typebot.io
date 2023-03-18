import { TextInput } from '@/components/inputs'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormLabel,
  Stack,
  Tag,
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
  const handleTrackingIdChange = (trackingId: string) =>
    onOptionsChange({ ...options, trackingId })

  const handleCategoryChange = (category: string) =>
    onOptionsChange({ ...options, category })

  const handleActionChange = (action: string) =>
    onOptionsChange({ ...options, action })

  const handleLabelChange = (label: string) =>
    onOptionsChange({ ...options, label })

  const handleValueChange = (value?: string) =>
    onOptionsChange({
      ...options,
      value: value ? parseFloat(value) : undefined,
    })

  return (
    <Stack spacing={4}>
      <TextInput
        label="ID de rastreamento:"
        defaultValue={options?.trackingId ?? ''}
        placeholder="G-123456..."
        onChange={handleTrackingIdChange}
      />
      <TextInput
        label="Categoria do evento:"
        defaultValue={options?.category ?? ''}
        placeholder="Examplo: Typebot"
        onChange={handleCategoryChange}
      />
      <TextInput
        label="Ação do evento:"
        defaultValue={options?.action ?? ''}
        placeholder="Examplo: enviar email"
        onChange={handleActionChange}
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
              label={
                <>
                  Rótulo do evento <Tag>Opcional</Tag>:
                </>
              }
              defaultValue={options?.label ?? ''}
              placeholder="Examplo: Campanha Z"
              onChange={handleLabelChange}
            />
            <TextInput
              label={
                <>
                  <FormLabel mb="0" htmlFor="value">
                    Valor do evento <Tag>Opcional</Tag>:
                  </FormLabel>
                </>
              }
              defaultValue={options?.value?.toString() ?? ''}
              placeholder="Examplo: 0"
              onChange={handleValueChange}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Stack>
  )
}
