import axios from 'axios'
import { getCookie } from 'cookies-next'
import jwt_decode from 'jwt-decode'
import { AuthJwt } from './interfaces/AuthJwt'

const jwt = getCookie('authJwt')

const token =
  typeof jwt === 'string' ? jwt_decode<AuthJwt>(jwt).token : undefined

export const instanceV2 = axios.create({
  baseURL: process.env.WHATSFLOW_API_URL_V2,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  },
})
