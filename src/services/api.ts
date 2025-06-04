import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3001/api' })

export default api

// Interfaces
export interface Rol {
  _id: string
  name: string
  description?: string
}

export interface Usuario {
  _id: string
  firstName: string
  lastName: string
  idNumber: string
  email: string
  role: Rol
}

// Rutas para Roles
export const getRoles = () =>
  api.get<Rol[]>('/roles').then(r => r.data)

export const createRole = (r: Omit<Rol, '_id'>) =>
  api.post<Rol>('/roles', r).then(r => r.data)

// Rutas para Usuarios
export const getUsers = () =>
  api.get<Usuario[]>('/users').then(r => r.data)

export const createUser = (u: {
  firstName: string
  lastName: string
  idNumber: string
  email: string
  role: string // ID del rol
}) =>
  api.post<Usuario>('/users', u).then(r => r.data)
