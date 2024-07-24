export interface ProjectItem {
    id: number
    name: string
    description: string
    price: number
    file: string
    code_structure: string
    assessment_criteria: string
    company: CompanyItem
}
export interface CompanyItem {
    id: number
    name: string
    password: string
    logo: string
    description: string
    url: string
    field: string
}

export interface CheckPointItem {
    id: number
    name: string
    description: string
    points: number
    project: number
}

export interface SubmissionItem {
    id: number
    github: string
    file: string
    date_time: string
    revisions: boolean
    accepted: boolean
    user: number
    checkpoint: number
}

export interface FeedbackItem {
    id: number
    grade: number
    comment: string
    date_time: string
    like: number
    dislike: number
    user: number
    submission: number
}

export interface AuthResponse {
    access: string
    refresh: string
}

export interface UserItem {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    phone: string
    github: string
    telegram_username: string
    telegram_id: number
}