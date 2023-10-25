import { appRouter } from '@/helpers/server/routers/v1/_app'
import { captureException } from '@sentry/nextjs'
import { createOpenApiNextHandler } from 'trpc-openapi'
import cors from 'nextjs-cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { createContext } from '@/helpers/server/context'

// This function can run for a maximum of 60 seconds
export const config = {
  maxDuration: 60,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res)

  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
    onError({ error }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        captureException(error)
        console.error('Something went wrong', error)
      }
    },
  })(req, res)
}

export default handler
