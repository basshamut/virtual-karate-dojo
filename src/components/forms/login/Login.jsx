import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputText} from "primereact/inputtext"
import {Message} from 'primereact/message'
import {getApplicationDomain, startSession} from "../../../utils/session.jsx"
import './Login.css';

export default function Login() {
    const [visible, setVisible] = useState(true)
    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    function doLogin() {
        if (validateEmail(user)) {
            const login = btoa(import.meta.env.VITE_SERVICE_USR + ':' + import.meta.env.VITE_SERVICE_PASS)
            const domain = getApplicationDomain()
            fetch(domain + '/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${login}`
                },
                body: JSON.stringify({
                    user: user,
                    password: btoa(password)
                })
            })
                .then(async response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then(data => {
                    data.password = btoa(password)
                    startSession(data)
                    navigate("/dojo/dashboard")
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error)
                    setErrorMessage("Correo o contraseña incorrectos")
                })
        } else {
            setErrorMessage("El email no es válido")
        }
    }

    function doRegister() {
        setVisible(false)
        navigate("/dojo/register")
    }

    return (
        <div className="card flex justify-content-center background-image">
            <Dialog
                visible={visible}
                modal
                onHide={() => setVisible(true)}
                content={() => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{
                        borderRadius: '12px',
                        backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))'
                    }}>
                        <img alt="Logo" className="login-logo" src="https://res.cloudinary.com/di7qko5q9/image/upload/v1727294772/karate-classes/sxgzokc8mysthpctbiir.png"/>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="username" className="text-primary-50 font-semibold">
                                Username
                            </label>
                            <InputText id="username" label="Username"
                                       className="bg-white-alpha-20 border-none p-3 text-primary-50" value={user}
                                       onChange={(e) => setUser(e.target.value)}></InputText>
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="password" className="text-primary-50 font-semibold">
                                Password
                            </label>
                            <InputText id="password" label="Password"
                                       className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password"
                                       value={password} onChange={(e) => setPassword(e.target.value)}></InputText>
                        </div>
                        {errorMessage && (
                            <Message severity="error" text={errorMessage} />
                        )}
                        <div className="flex align-items-center gap-2">
                            <Button label="Entrar" onClick={() => doLogin()} text
                                    className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Recuperar password" onClick={() => setVisible(false)} text
                                    className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Registrarse" onClick={() => doRegister()} text
                                    className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </div>
    )
}
