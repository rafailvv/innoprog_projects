export interface ProjectItem {
    id: number
    name: string
    description: string
    price: number
    file: string
    code_structure: string
    assessment_criteria: string
    company: CompanyItem
    difficulty: Difficulty,
    users_in_progress : string,
}
export enum Difficulty {
    easy = "easy",
    medium = "medium",
    hard = "hard"
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
    is_done: string
}

export interface SubmissionItem {
    id: number
    user: UserItem
    checkpoint: CheckPointItem
    github: string
    file: string
    date_time: string
    is_visible: boolean
    accepted: boolean
    name: string
    avg_grade: string
}

export interface FeedbackItem {
    id: number
    user: UserItem
    submission: SubmissionItem
    grade: number
    comment: string
    date_time: string
    like: number
    dislike: number
}

export interface FeedbackRequest {
    grade: number
    comment: string
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
    photo_fase : string
    teacher: boolean
    position: string
}