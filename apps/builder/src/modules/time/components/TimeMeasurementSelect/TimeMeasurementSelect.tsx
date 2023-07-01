import { Select, SelectProps } from '@chakra-ui/react'
import { WaitForTypeEnum, WaitForTypeEnumLabel } from '@typebot.io/schemas'

type TimeMeasurementSelectProps = Omit<SelectProps, 'children'>

export function TimeMeasurementSelect(props: TimeMeasurementSelectProps) {
  return (
    <Select {...props}>
      {Object.values(WaitForTypeEnum).map((type) => (
        <option key={type} value={type}>
          {WaitForTypeEnumLabel[type]}
        </option>
      ))}
    </Select>
  )
}
