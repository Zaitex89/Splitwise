import axios from "axios"
import type { Group } from "../types/index"

const BASE_URL = "http://127.0.0.1:8000"

export const getGroups = async (): Promise<Group[]> => {
    const res = await axios.get(`${BASE_URL}/groups/`)
    return res.data
}

export const getGroup = async (id: number): Promise<Group> => {
    const res = await axios.get(`${BASE_URL}/groups/${id}`)
    return res.data
}

export const createGroup = async (data: { name: string; member_ids: number[] }): Promise<Group> => {
    const res = await axios.post(`${BASE_URL}/groups/`, data)
    return res.data
}

export const deleteGroup = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/groups/${id}/`)
}