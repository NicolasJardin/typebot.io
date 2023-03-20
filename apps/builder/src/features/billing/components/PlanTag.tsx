import { Tag, TagProps } from '@chakra-ui/react'
import { Plan } from '@typebot.io/prisma'
import { Fragment } from 'react'

export const planColorSchemes = {
  [Plan.LIFETIME]: 'purple',
  [Plan.PRO]: 'blue',
  [Plan.OFFERED]: 'orange',
  [Plan.STARTER]: 'orange',
  [Plan.FREE]: 'gray',
  [Plan.CUSTOM]: 'yellow',
  [Plan.UNLIMITED]: 'yellow',
}

export const PlanTag = ({
  plan,
  ...props
}: { plan: Plan } & TagProps): JSX.Element => {
  switch (plan) {
    case Plan.LIFETIME: {
      return (
        <Tag
          colorScheme={planColorSchemes[plan]}
          data-testid="lifetime-plan-tag"
          {...props}
        >
          Lifetime
        </Tag>
      )
    }
    case Plan.PRO: {
      return (
        <Tag
          colorScheme={planColorSchemes[plan]}
          data-testid="pro-plan-tag"
          {...props}
        >
          Pro
        </Tag>
      )
    }
    case Plan.OFFERED:
    case Plan.STARTER: {
      return (
        <Tag
          colorScheme={planColorSchemes[plan]}
          data-testid="starter-plan-tag"
          {...props}
        >
          Starter
        </Tag>
      )
    }
    case Plan.FREE: {
      return (
        <Tag
          colorScheme={planColorSchemes[Plan.FREE]}
          data-testid="free-plan-tag"
          {...props}
        >
          Grátis
        </Tag>
      )
    }
    case Plan.CUSTOM: {
      return (
        <Tag
          colorScheme={planColorSchemes[Plan.CUSTOM]}
          data-testid="custom-plan-tag"
          {...props}
        >
          Custom
        </Tag>
      )
    }
    case Plan.UNLIMITED: {
      return (
        <Tag
          colorScheme={planColorSchemes[Plan.UNLIMITED]}
          data-testid="custom-unlimite-tag"
          {...props}
        >
          Unlimited
        </Tag>
      )
    }
  }

  return <Fragment />
}
