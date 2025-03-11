import {Button} from 'primereact/button'
import {useNavigate} from "react-router-dom"

export default function EmailVerification() {
    const navigate = useNavigate()

    return (
        <div className="card flex justify-content-center background-image">
            <div className="flex flex-column px-8 py-5 gap-4" style={{
                borderRadius: '12px',
                backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))'
            }}>
                <h2 className="text-primary-50">Verificación de correo electrónico</h2>
                <p className="text-primary-50">Se ha enviado un enlace de verificación a su correo electrónico. Por favor, verifique su correo para activar su cuenta.</p>
                <div className="flex align-items-center gap-2">
                    <Button label="Aceptar" onClick={() => navigate("/dojo/login")} text
                            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                </div>
            </div>
        </div>
    )
}
