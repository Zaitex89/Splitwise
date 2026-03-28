import axios from "axios"
import type { Balance } from "../types/index"

const BASE_URL = "http://127.0.0.1:8000"

export const getGroupBalances = async (groupId: number): Promise<Balance[]> => {
    const res = await axios.get(`${BASE_URL}/groups/${groupId}/balances`)
    return res.data.balances
}