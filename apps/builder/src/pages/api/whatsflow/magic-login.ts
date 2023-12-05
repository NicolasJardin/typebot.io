import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authWfID: string = `${req.query.authWfID}`
  const authJwt: string = `${req.query.authJwt}`
  const domain: string = `${req.query.domain}`
  const schema: string = `${req.query.schema}`

  const cookieConfig = {
    maxAge: 180 * 24 * 60 * 60,
    httpOnly: true,
    secure: true,
    domain: domain,
    path: '/',
  }

  const cookie1 = serialize('authId', authWfID, cookieConfig)
  const cookie2 = serialize('authJwt', authJwt, cookieConfig)

  res
    .setHeader('Set-Cookie', [cookie1, cookie2])
    .redirect(`${schema}://${domain}`)
}
