import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputText} from "primereact/inputtext"
import {useState} from "react"
import {Calendar} from "primereact/calendar"
import {useNavigate} from "react-router-dom"
import {getApplicationDomain} from "../../../utils/session"


export default function Register() {
    const today = new Date();
    const majorityAgeDate = new Date(today.getFullYear() - 18, 0, 1)
    const [visible, setVisible] = useState(true)
    const [date, setDate] = useState(majorityAgeDate)
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const domain = getApplicationDomain()


    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    function validatePassword(password) {
        return password.length >= 8
    }

    function validateForm() {
        const newErrors = {}

        if (!user) {
            newErrors.user = "El email es requerido"
        } else if (!validateEmail(user)) {
            newErrors.user = "El formato del email no es válido"
        }

        if (!date) {
            newErrors.date = "La fecha de nacimiento es requerida"
        } else if (date > majorityAgeDate) {
            newErrors.date = "Debes ser mayor de 18 años"
        }

        if (!password) {
            newErrors.password = "La contraseña es requerida"
        } else if (!validatePassword(password)) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres"
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    function doRegister() {
        if (validateForm()) {
            const login = btoa(import.meta.env.VITE_SERVICE_USR + ':' + import.meta.env.VITE_SERVICE_PASS)
            fetch(domain + '/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${login}`
                },
                body: JSON.stringify({user, date, password})
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok:' + response.status)
                    }
                })
                .then(() => {
                    setVisible(false)
                    navigate("/email-verification")
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error)
                })
        }
    }

    function doCancel() {
        setVisible(false)
        navigate("/login")
    }

    function pushDate(e) {
        console.log(e)
        console.log(e.value)
        setDate(e.value)
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
                        <img alt="Logo" className="login-logo"
                             src="https://res.cloudinary.com/di7qko5q9/image/upload/v1727294772/karate-classes/sxgzokc8mysthpctbiir.png"/>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="username" className="text-primary-50 font-semibold">
                                Email (Este será su nombre de usuario)
                            </label>
                            <InputText id="username" label="Username"
                                       className="bg-white-alpha-20 border-none p-3 text-primary-50" value={user}
                                       onChange={(e) => setUser(e.target.value)}></InputText>
                            {errors.user && <small className="p-error">{errors.user}</small>}
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="meetDate" className="text-primary-50 font-semibold">
                                Fecha de Nacimiento
                            </label>
                            <Calendar id="majorityAgeDate"
                                      value={date} onChange={(e) => pushDate(e)}
                                      dateFormat="dd/mm/yy"
                                      maxDate={majorityAgeDate}/>
                            {errors.date && <small className="p-error">{errors.date}</small>}
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="password" className="text-primary-50 font-semibold">
                                Password
                            </label>
                            <InputText id="password" label="Password"
                                       className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password"
                                       value={password} onChange={(e) => setPassword(e.target.value)}></InputText>
                            {errors.password && <small className="p-error">{errors.password}</small>}
                        </div>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="confirmPassword" className="text-primary-50 font-semibold">
                                Confirmar Password
                            </label>
                            <InputText id="confirmPassword" label="Password"
                                       className="bg-white-alpha-20 border-none p-3 text-primary-50" type="password"
                                       value={confirmPassword}
                                       onChange={(e) => setConfirmPassword(e.target.value)}></InputText>
                            {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Registrar" onClick={() => doRegister()} text
                                    className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Cancelar" onClick={() => doCancel()} text
                                    className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </div>
    )
}
