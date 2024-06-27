import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputText} from "primereact/inputtext"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {startSession} from "../../../utils/session.jsx"
import background from "/Shotokan_Fondo.svg"


export default function Login() {
    const [visible, setVisible] = useState(true)
    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const domain = "http://86.38.204.61"//import.meta.env.VITE_API_URL

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    function doLogin() {
        if (validateEmail(user)) {
            fetch(domain + '/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                    navigate("/virtual-dojo/frontend/dashboard")
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error)
                })
        } else {
            alert("El email no es válido")
        }
    }

    function doRegister() {
        setVisible(false)
        navigate("/virtual-dojo/frontend/register")
    }

    return (
        <div className="card flex justify-content-center"
             style={{backgroundImage: `url(${background})`, backgroundSize: 'cover', height: '100vh'}}>
            <Dialog
                visible={visible}
                modal
                onHide={() => setVisible(true)}
                content={() => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{
                        borderRadius: '12px',
                        backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))'
                    }}>
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
