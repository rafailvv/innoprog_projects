import {ProjectItem, UserItem} from "../models/types";
import {makeAutoObservable} from "mobx";
import ApiService from "../services/ApiService";

export default class Store {
    user = {} as UserItem
    isAuth = false;
    badRequest = {} as any;
    projects = [] as ProjectItem[];

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(state: boolean) {
        this.isAuth = state
    }

    setUser(user: UserItem) {
        this.user = user
    }

    setBadRequest(badRequest: any) {
        this.badRequest = badRequest
        console.log(badRequest)
    }

    setProjects(projects: ProjectItem[]) {
        this.projects = projects
    }

    async checkAuth() {
        try {
            const response = await ApiService.getRefresh();
            console.log(response)
            localStorage.setItem('token', response.data.access);
            this.setAuth(true);
        }catch (err: any) {
            console.error(err.response?.data);
            this.setAuth(false);
            localStorage.removeItem('refresh');
            localStorage.removeItem('token');
            window.location.reload();
            if (err.response?.status === 400) {
                this.setBadRequest(err.response.data);
            }
        }

    }

    async login(username: string, password: string) {
        try {
            this.setBadRequest(null);
            const response = await ApiService.login(username, password);
            console.log(response)
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            this.setAuth(true);
        } catch (err: any) {
            console.error(err.response?.data);
            if (err.response?.status === 400) {
                this.setBadRequest(err.response.data);
            }
        }
    }

    async register(username: string, password: string, email: string, first_name: string, last_name: string, phone: string, github: string, telegram_username: string, telegram_id: number) {
        try {
            this.setBadRequest(null);
            const response = await ApiService.register(username, password, email, first_name, last_name, phone, github, telegram_username, telegram_id);
            this.setUser(response.data);
        } catch (err: any) {
            console.error(err.response?.data);
            if (err.response?.status === 400) {
                this.setBadRequest(err.response.data);
            }
        }
    }

    async logout() {
        try {
            await ApiService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            this.setAuth(false);
        } catch (err) {
            console.error(err);
        }
    }

    async getProjects() {
        try {
            const response = await ApiService.getProjects();
            console.log(response)
            this.setProjects(response.data);
        } catch (err) {
            console.error(err);
        }
    }

}