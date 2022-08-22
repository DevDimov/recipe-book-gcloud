import { MutableRefObject } from "react"

export type AccessRefArrayStringType = {
    accessRef: MutableRefObject<string[]>
}

export type AccessRefInputType = {
    accessRef: MutableRefObject<HTMLInputElement>
}

export type Recipe = {
    id: string,
    name: string,
    category: string[],
    description: string,
    image: string,
    ingredients: string,
    method: string[],
    prepTime: number,
    servings: number
}

export type InsertResponse = {
    insertedId?: string,
    results?: any
    error?: string
}

