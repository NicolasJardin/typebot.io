import { Seo } from '@/components/Seo'
import { TextLink } from '@/components/TextLink'
import { Heading, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { SignInForm } from './SignInForm'
import { useScopedI18n } from '@/locales'

type Props = {
  type: 'signin' | 'signup'
  defaultEmail?: string
}

export const SignInPage = ({ type }: Props) => {
  const { query } = useRouter()

  const scopedT = useScopedI18n('auth')

  return (
    <VStack spacing={4} h="100vh" justifyContent="center">
      <Seo title={type === 'signin' ? 'Entrar' : 'Registrar'} />
      <Heading
        onClick={() => {
          throw new Error('Sentinela está funcionando')
        }}
      >
        {type === 'signin' ? 'Entrar' : 'Crie a sua conta aqui'}
      </Heading>
      {type === 'signin' ? (
        <Text>
          Não tem uma conta ?{' '}
          <TextLink href="/register">Inscreva-se gratuitamente</TextLink>
        </Text>
      ) : (
        <Text>
          já tem uma conta? <TextLink href="/signin">Entrar</TextLink>
        </Text>
      )}
      <SignInForm defaultEmail={query.g?.toString()} />
      {type === 'signup' ? (
        <Text fontSize="sm" maxW="400px" textAlign="center">
          {scopedT('register.aggreeToTerms', {
            termsOfService: (
              <TextLink href={'https://typebot.io/terms-of-service'}>
                {scopedT('register.termsOfService')}
              </TextLink>
            ),
            privacyPolicy: (
              <TextLink href={'https://typebot.io/privacy-policies'}>
                {scopedT('register.privacyPolicy')}
              </TextLink>
            ),
          })}
        </Text>
      ) : null}
    </VStack>
  )
}
