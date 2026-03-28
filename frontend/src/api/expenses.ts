import axios from "axios"
import type { Expense } from "../types/index"

const BASE_URL = "http://127.0.0.1:8000"

export const getGroupExpenses = async (groupId: number): Promise<Expense[]> => {
    const res = await axios.get(`${BASE_URL}/groups/${groupId}/expenses`)
    return res.data
}

export const createExpense = async (data: {
    title: string
    amount: number
    group_id: number
    paid_by: number
    split_between: number[]
}): Promise<Expense> => {
    const res = await axios.post(`${BASE_URL}/expenses/`, data)
    return res.data
}