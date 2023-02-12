import { useCallback } from 'react'
import axios from 'axios'
import { Department } from '../interfaces/Department'
import { Attendant } from '../interfaces/Attendant'

export default function useTransfer() {
  const getDepartments = useCallback(
    async () => (await axios.get<Department[]>('/rota')).data,
    []
  )

  const getAttendants = useCallback(
    async () => (await axios.get<Attendant[]>('/rota')).data,
    []
  )

  return {
    getDepartments,
    getAttendants,
  }
}
