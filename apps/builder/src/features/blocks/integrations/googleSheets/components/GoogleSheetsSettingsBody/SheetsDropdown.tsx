import { MoreInfoTooltip } from '@/components/MoreInfoTooltip'
import { SearchableDropdown } from '@/components/SearchableDropdown'
import { HStack, Input } from '@chakra-ui/react'
import { useMemo } from 'react'
import { isDefined } from 'utils'
import { Sheet } from '../../types'

type Props = {
  sheets: Sheet[]
  isLoading: boolean
  sheetId?: string
  onSelectSheetId: (id: string) => void
}

export const SheetsDropdown = ({
  sheets,
  isLoading,
  sheetId,
  onSelectSheetId,
}: Props) => {
  const currentSheet = useMemo(
    () => sheets?.find((s) => s.id === sheetId),
    [sheetId, sheets]
  )

  const handleSpreadsheetSelect = (name: string) => {
    const id = sheets?.find((s) => s.name === name)?.id
    if (isDefined(id)) onSelectSheetId(id)
  }

  if (isLoading) return <Input value="Carregando..." isDisabled />
  if (!sheets || sheets.length === 0)
    return (
      <HStack>
        <Input value="No sheets found" isDisabled />
        <MoreInfoTooltip>
          Verifique se sua planilha contém pelo menos uma página com um
          cabeçalho linha.
        </MoreInfoTooltip>
      </HStack>
    )
  return (
    <SearchableDropdown
      selectedItem={currentSheet?.name}
      items={(sheets ?? []).map((s) => s.name)}
      onValueChange={handleSpreadsheetSelect}
      placeholder={'Selecione a folha'}
    />
  )
}
