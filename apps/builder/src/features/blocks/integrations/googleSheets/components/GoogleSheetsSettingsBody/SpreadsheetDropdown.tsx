import { SearchableDropdown } from '@/components/SearchableDropdown'
import { Input, Tooltip } from '@chakra-ui/react'
import { useMemo } from 'react'
import { useSpreadsheets } from '../../hooks/useSpreadsheets'

type Props = {
  credentialsId: string
  spreadsheetId?: string
  onSelectSpreadsheetId: (id: string) => void
}

export const SpreadsheetsDropdown = ({
  credentialsId,
  spreadsheetId,
  onSelectSpreadsheetId,
}: Props) => {
  const { spreadsheets, isLoading } = useSpreadsheets({
    credentialsId,
  })
  const currentSpreadsheet = useMemo(
    () => spreadsheets?.find((s) => s.id === spreadsheetId),
    [spreadsheetId, spreadsheets]
  )

  const handleSpreadsheetSelect = (name: string) => {
    const id = spreadsheets?.find((s) => s.name === name)?.id
    if (id) onSelectSpreadsheetId(id)
  }
  if (isLoading) return <Input value="Loading..." isDisabled />
  if (!spreadsheets || spreadsheets.length === 0)
    return (
      <Tooltip label="Nenhuma planilha encontrada, verifique se você tem pelo menos uma planilha que contém uma linha de cabeçalho">
        <span>
          <Input value="Nenhuma planilha encontrada" isDisabled />
        </span>
      </Tooltip>
    )
  return (
    <SearchableDropdown
      selectedItem={currentSpreadsheet?.name}
      items={(spreadsheets ?? []).map((s) => s.name)}
      onValueChange={handleSpreadsheetSelect}
      placeholder={'Pesquisar planilha'}
    />
  )
}
