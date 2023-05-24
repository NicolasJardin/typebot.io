import { useColorMode } from '@chakra-ui/react'
import { useCallback } from 'react'
import Select, { Props } from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

type MultiSelectProps = Props

export default function MultiSelect(props: MultiSelectProps) {
  const { colorMode } = useColorMode()

  const getColor = useCallback(
    (isFocused: boolean) => {
      if (colorMode === 'dark') {
        if (isFocused) return '#000'

        return '#fff'
      }
    },
    [colorMode]
  )

  return (
    <Select
      {...props}
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      menuPortalTarget={document.body}
      styles={{
        option: (base, { isFocused }) => ({
          ...base,
          color: getColor(isFocused),
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      theme={
        colorMode === 'dark'
          ? (theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                neutral0: '#1F1F23',
                neutral10: '#add8e6',
                dangerLight: '#ade2e6',
                primary: '#add8e6',
                primary25: '#add8e6',
                primary50: '#add8e6',
                primary75: '#add8e6',
              },
            })
          : undefined
      }
    />
  )
}
