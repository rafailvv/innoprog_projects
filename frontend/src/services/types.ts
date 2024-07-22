export interface ProjectItem {
    id: number
    name: string
    description: string
    price: number
    file: string
    code_structure: string
    assessment_criteria: string
    company: number
}
export interface Company {
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