import { SetVariableLabel } from '@/components/SetVariableLabel'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { Stack, Text } from '@chakra-ui/react'
import { GoogleSheetsAction, GoogleSheetsOptions } from '@typebot.io/schemas'

type Props = {
  options?: GoogleSheetsOptions
}

export const GoogleSheetsNodeContent = ({ options }: Props) => {
  const { typebot } = useTypebot()
  return (
    <Stack>
      <Text color={options?.action ? 'currentcolor' : 'gray.500'} noOfLines={1}>
        {options?.action ?? 'Configure...'}
      </Text>
      {typebot &&
        options?.action === GoogleSheetsAction.GET &&
        options?.cellsToExtract
          .map((mapping) => mapping.variableId)
          .map((variableId, idx) =>
            variableId ? (
              <SetVariableLabel
                key={variableId + idx}
                variables={typebot.variables}
                variableId={variableId}
              />
            ) : null
          )}
    </Stack>
  )
}
