import axios from "axios"
import type { User } from "../types/index"

const BASE_URL = "http://127.0.0.1:8000"

export const getUsers = async (): Promise<User[]> => {
    const res = await axios.get(`${BASE_URL}/users/`)
    return res.data
}

export const createUser = async (data: { name: string; email: string }): Promise<User> => {
    const res = await axios.post(`${BASE_URL}/users/`, data)
    return res.data
}

export const deleteUser = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/users/${id}/`)
}