const SESSION_KEY = 'user_session'
// export const SESSION_DURATION = 60 * 1000 // 1 minuto
export const SESSION_DURATION = 30 * 60 * 1000 // 30 minutos

export const startSession = (userData) => {
    const sessionData = {
        userData,
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