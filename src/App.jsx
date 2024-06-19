import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom'; // Import necessary components
import Dashboard from "./pages/dashboard/Dashboard.jsx";
// import PaymentResult from "./pages/payment/PaymentResult.jsx"; // TODO Import the PaymentResult page

import {useEffect} from "react";
import {getSession, SESSION_DURATION} from './utils/session';
import './App.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Login from "./components/forms/login/Login.jsx";

function InnerApp() {
    const navigate = useNavigate()

    useEffect(() => {
        const interval = setInterval(() => {
            const sessionUser = getSession();
            if (!sessionUser) {
                navigate('/login');
            }
        },  SESSION_DURATION); // Verifica cada 1 minuto
        return () => clearInterval(interval);
    }, []);

    return (
        <>

            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
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
