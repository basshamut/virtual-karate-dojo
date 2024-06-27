import {Button} from 'primereact/button'
import {Dialog} from 'primereact/dialog'
import {InputText} from "primereact/inputtext"
import {useState} from "react"
import background from "/Shotokan_Fondo.svg"
import {Calendar} from "primereact/calendar"
import {useNavigate} from "react-router-dom";

export default function Register() {
    const [visible, setVisible] = useState(true)
    const [date, setDate] = useState()
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const domain = import.meta.env.VITE_API_URL

    const today = new Date()
    const majorityAgeDate = new Date(today.getFullYear() - 18, 0, 1)

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
            fetch(domain + '/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                    navigate("/virtual-dojo/frontend/login")
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error)
                })
        }
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
                            <Calendar value={majorityAgeDate} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy"
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
                    </div>
                )}
            ></Dialog>
        </div>
    )
}
