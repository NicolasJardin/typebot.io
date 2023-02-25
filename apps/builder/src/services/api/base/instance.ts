import axios from 'axios'
import { getCookie } from 'cookies-next'
import jwt_decode from 'jwt-decode'
import { AuthJwt } from './interfaces/AuthJwt'

const jwt = getCookie('authJwt')

const token =
  typeof jwt === 'string' ? jwt_decode<AuthJwt>(jwt).token : undefined

export const instance = axios.create({
  baseURL: 'https://api.whatsflow.com.br/v1/',
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  },
})
