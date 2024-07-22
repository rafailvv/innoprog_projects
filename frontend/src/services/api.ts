export function getProjects() {
    return fetch("https://projects.innoprog.ru/lite/project/all/", {
        method: 'GET',
        cache: 'force-cache',
        credentials: 'include',
        headers: {
            "accept": "application/json",
        },
    })
}

export function postLogin(username: string, password: string) {
    return fetch("https://projects.innoprog.ru/lite/login/", {
        method: 'POST',
        // cache: 'force-cache',
        credentials: 'include',
        headers: {
            "accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
}
export function postRegistration(username: string, password: string, email: string, first_name: string, last_name: string, phone: string, github: string, telegram_username: string, telegram_id: number) {
    return fetch("https://projects.innoprog.ru/lite/registration/", {
        method: 'POST',
        headers: {
            "accept": "application/json",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            email,
            first_name,
            last_name,
            phone,
            github,
            telegram_username,
            telegram_id
        }),
    })
}

export function getProjectById(id: number) {
    return fetch(`https://projects.innoprog.ru/lite/project/${id}/`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function getUserProjects() {
    return fetch(`https://projects.innoprog.ru/lite/project/user/`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function getCheckPoint(id: number) {
    return fetch(`https://projects.innoprog.ru/lite/checkpoint/${id}/`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}
export function getProfile(cookie: string) {
    return fetch(`https://projects.innoprog.ru/lite/profile/`, {
        credentials: 'include',
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function getCompanyById(id: number) {
    return fetch(`https://projects.innoprog.ru/lite/company/${id}`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function getCheckPointsByProjectId(id: number) {
    return fetch(`https://projects.innoprog.ru/lite/checkpoint/${id}/`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function getSubmissionsByCheckPointId(id: number) {
    return fetch(`https://projects.innoprog.ru/lite/submission/${id}`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function getFeedbackBySubmissionId(id: number) {
    return fetch(`https://projects.innoprog.ru/lite/feedback/${id}`, {
        method: 'GET',
        headers: {
            "accept": "application/json",
        },
    })
}

export function postSubmissionByCheckPointId(id: number, github: string, file: string) {
    return fetch(`https://projects.innoprog.ru/lite/submission/${id}`, {
        method: 'POST',
        headers: {
            "accept": "application/json",
        },
        body: JSON.stringify({ github, file }),
    })
}