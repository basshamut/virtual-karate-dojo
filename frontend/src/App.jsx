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
import Validation from "./pages/validation/Validation";
import EmailVerification from "./pages/validation/EmailVerification";

function InnerApp() {
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            const sessionUser = getSession()
            if (!sessionUser) {
                navigate('/virtual-dojo/frontend/login')
            }
        },  SESSION_DURATION) // Verifica cada 1 minuto
        return () => clearInterval(interval)
    }, [])

    return (
        <>

            <Routes>
                <Route path="/virtual-dojo/frontend/login" element={<Login/>}/>
                <Route path="/virtual-dojo/frontend/register" element={<Register/>}/>
                <Route path="/virtual-dojo/frontend/validation" element={<Validation/>}/>
                <Route path="/virtual-dojo/frontend/dashboard" element={<Dashboard/>}/>
                <Route path="/virtual-dojo/frontend/email-verification" element={<EmailVerification/>}/>
                <Route path="/virtual-dojo/frontend" element={<Login/>}/>
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

/*TODO
* -. Agregar job para envio de mails con link de conexion 1hr antes de la clase
* -. Dar estilo a la factura de compra
* -. Agregar soporte de idiomas
 */