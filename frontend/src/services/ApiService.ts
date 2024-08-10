import axios, { AxiosResponse } from "axios";
import $api, { API_URL } from "../http";
import {
    AuthResponse,
    CheckPointItem,
    CompanyItem,
    FeedbackItem,
    FeedbackRequest,
    ProjectItem,
    SubmissionItem,
    UserItem
} from "../models/types";

export default class ApiService {
    //auth
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse | any>> {
        return $api.post<AuthResponse | any>('/login/', { username, password })
    }

    // static async loginTg(telegram_id: string): Promise<AxiosResponse<AuthResponse>> {
    //     return $api.post<AuthResponse>('/login/tg/', { token })
    // }

    static async register(username: string, password: string, email: string,
        first_name: string, last_name: string, phone: string, github: string,
        telegram_username: string, telegram_id: number): Promise<AxiosResponse<any>> {
        return $api.post<any>('/registration/', { username, password, email, first_name, last_name, phone, github, telegram_username, telegram_id })
    }

    static async logout(): Promise<void> {
        return $api.post('/logout/', {"refresh": localStorage.getItem('refresh')})
    }

    //users
    static async getProjects(): Promise<AxiosResponse<any>> {
        return $api.get('/project/all/')
    }
    static async getHotProjects(): Promise<AxiosResponse<ProjectItem[]>> {
        return $api.get('/project/hot/')
    }
    static async getDoneProjects(): Promise<AxiosResponse<ProjectItem[]>> {
        return $api.get('/project/done/')
    }
    static async getInProgressProjects(): Promise<AxiosResponse<ProjectItem[]>> {
        return $api.get('/project/in-progress/')
    }
    static async getProfile(): Promise<AxiosResponse<UserItem>> {
        return $api.get(`/profile/`)
    }
    static async getProjectById(id: number): Promise<AxiosResponse<ProjectItem>> {
        return $api.get(`/project/${id}/`)
    }
    static async getCheckPointsByProjectId(id: number): Promise<AxiosResponse<CheckPointItem[]>> {
        return $api.get(`/checkpoint/${id}/`)
    }
    static async getCompanyById(id: number): Promise<AxiosResponse<CompanyItem>> {
        return $api.get(`/company/${id}/`)
    }
    static async getSubmissionsByCheckPointId(id: number): Promise<AxiosResponse<{user_submissions: SubmissionItem[], other_submissions: SubmissionItem[]}>> {
        return $api.get(`/submission/${id}/`)
    }
    static async getFeedbacksBySubmissionId(id: number): Promise<AxiosResponse<FeedbackItem[]>> {
        return $api.get(`/feedback/${id}/`)
    }
    static async postSubmissionByCheckPointId(id: number, github: string, file: string): Promise<AxiosResponse<any>> {
        return $api.post(`/submission/${id}/`, {"github": github, "file": file})
    }

    static async postLikeByFeedbackId(id: number, value: number): Promise<AxiosResponse<FeedbackItem>> {
        return $api.post(`/feedback/like/${id}/`, {"value": value})
    }
    static async postDislikeByFeedbackId(id: number, value: number): Promise<AxiosResponse<FeedbackItem>> {
        return $api.post(`/feedback/dislike/${id}/`, {"value": value})
    }
    static async postFeedbackBySubmissionId(id: number, feedbackRequest: FeedbackRequest): Promise<AxiosResponse<FeedbackItem>> {
        return $api.post(`/feedback/${id}/`, {"grade": feedbackRequest.grade, "comment": feedbackRequest.comment})
    }

    static async postProjectExecution(id: number): Promise<AxiosResponse<ProjectItem>> {
        return $api.post(`/project/execution/${id}/`)
    }
    static async deleteProjectExecution(id: number): Promise<AxiosResponse<ProjectItem>> {
        return $api.post(`/project/execution/${id}/`)
    }

    static async getRefresh() {
        return axios.post(`${API_URL}/refresh/`, {"refresh": localStorage.getItem('refresh')})
    }
}