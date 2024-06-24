import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom' // Import necessary components
import {useEffect} from "react"
import Dashboard from "./pages/dashboard/Dashboard.jsx"
import {getSession, SESSION_DURATION} from './utils/session.jsx'
import './App.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import Login from "./components/forms/login/Login.jsx"
import Register from "./components/forms/register/Register.jsx"

function InnerApp() {
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            const sessionUser = getSession()
            if (!sessionUser) {
                navigate('/login')
            }
        },  SESSION_DURATION) // Verifica cada 1 minuto
        return () => clearInterval(interval)
    }, [])

    return (
        <>

            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard/*" element={<Dashboard/>}/>
                <Route path="/" element={<Login/>}/>
            </Routes>
        </>
    )

}
export default function App() {
    return (
        <Router>
            <InnerApp />
        </Router>
    )
}
