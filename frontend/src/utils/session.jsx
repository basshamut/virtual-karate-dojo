// export const SESSION_DURATION = 60 * 1000 // 1 minuto
export const SESSION_DURATION = 30 * 60 * 1000 // 30 minutos
const SESSION_KEY = 'user_session'

export const startSession = (userData) => {
    const sessionData = {
        userData: userData,
        expiry: new Date().getTime() + SESSION_DURATION
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
}

export const getSession = () => {
    const sessionData = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!sessionData) return null

    if (new Date().getTime() > sessionData.expiry) {
        localStorage.removeItem(SESSION_KEY)
        return null
    }
    return sessionData.userData
}

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY)
}

export const hasSession = () => {
    const sessionData = getSession()
    return sessionData && sessionData.role
}

export const isUser = () => {
    const sessionData = getSession()
    return sessionData && sessionData.role && sessionData.role === 'USER'
}

export const isAdmin = () => {
    const sessionData = getSession()
    return sessionData && sessionData.role && sessionData.role === 'ADMIN'
}

export const getBase64CredentialsFromSession = () => {
    const sessionData = getSession()
    if (!sessionData) {
        return ''
    }

    return btoa(sessionData.email + ':' + sessionData.password)
}

export const getApplicationDomain = () => {
    return import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://86.38.204.61'
}
