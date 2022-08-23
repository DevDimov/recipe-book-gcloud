export type RecipeSQL = {
    id: string,
    name: string,
    description: string,
    ingredients: string,
    prepTime: number,
    servings: number,
    category1: string,
    category2: string,
    category3: string,
    step1: string,
    step2: string,
    step3: string,
    step4: string,
    step5: string,
    step6: string,
    step7: string,
    step8: string,
    image: string
}

export type RecipeJSON = {
    id: string,
    name: string,
    description: string,
    ingredients: string,
    prepTime: number,
    servings: number,
    category: string[],
    method: string[]
}

export type RecipeTableRecord = {
    id: string,
    name: string,
    description: string,
    ingredients: string,
    prepTime: number,
    servings: number
}

export type CategoryTableRecord = {
    id: string,
    category1: string,
    category2: string | null,
    category3: string | null,
}

export type MethodTableRecord = {
    id: string,
    step1: string,
    step2: string | null,
    step3: string | null,
    step4: string | null,
    step5: string | null,
    step6: string | null,
    step7: string | null,
    step8: string | null,
}

export type ImageTableRecord = {
    id: string,
    image: string
}

export type SearchFilters = {
    category: string[],
    prepTime: number,
    servings: number,
    ingredientMatch: string
}