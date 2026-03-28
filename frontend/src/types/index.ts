export interface User {
    id: number
    name: string
    email: string
}

export interface Group {
    id: number
    name: string
    members: User[]
}

export interface GroupCreate {
    name: string
    member_ids: number[]
}

export interface Expense {
    id: number
    title: string
    amount: number
    group_id: number
    paid_by: number
    split_between: number[]
    created_at: string
}

export interface Balance {
    user_id: number
    name: string
    amount: number
}
