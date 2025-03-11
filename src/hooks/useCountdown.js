import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

export function useCountdown(initialCount, isActive) {
    const [countdown, setCountdown] = useState(initialCount)
    const navigate = useNavigate()

    useEffect(() => {
        let timer
        if (isActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1)
            }, 1000)
        } else if (countdown === 0) {
            navigate("/dojo/login")
        }
        return () => clearInterval(timer)
    }, [isActive, countdown, navigate])

    return countdown
}
