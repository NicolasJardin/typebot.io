import { WaitForOptions, WaitForTypeEnum } from '@typebot.io/schemas'
import { add, set } from 'date-fns'

export const getUntil = (options: WaitForOptions) => {
  let date = new Date()

  if (options.type === WaitForTypeEnum.DAY) {
    date = add(new Date(), {
      days: Number(options.number),
    })
  }

  if (options.type === WaitForTypeEnum.HOUR) {
    date = add(new Date(), {
      hours: Number(options.number),
    })
  }

  if (options.type === WaitForTypeEnum.MINUTE) {
    date = add(new Date(), {
      minutes: Number(options.number),
    })
  }

  const hours = options.time?.split(':')?.[0]
  const minutes = options.time?.split(':')?.[1]

  if (hours && minutes && options.type === WaitForTypeEnum.DAY) {
    date = set(date, {
      hours: Number(hours),
      minutes: Number(minutes),
      seconds: 0,
    })
  }

  return date
}
