import {useLocation} from 'react-router-dom'
import {useState} from "react"
import {Dialog} from 'primereact/dialog'
import {Button} from 'primereact/button'
import {useValidation} from '../../hooks/useValidation'
import {useCountdown} from '../../hooks/useCountdown'

export default function Validation() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const mail = params.get('mail')
    const {state, errorMessage} = useValidation(mail)
    const countdown = useCountdown(15, state === 'succeeded')

    return (
        <div>
            <Dialog
                header="Estado de Validación"
                visible={state !== ''}
                modal
                onHide={() => {
                }}
                footer={
                    <div>
                        <Button label="Aceptar" icon="pi pi-check" onClick={() => {
                            window.location.href = '/dojo/login'
                        }}/>
                    </div>
                }>
                {state === 'succeeded' && <p>Validación exitosa. Redirigiendo al login en {countdown} segundos...</p>}
                {state === 'canceled' && <p>{errorMessage}</p>}
                {!state && <p>Estado desconocido</p>}
            </Dialog>
        </div>
    )
}
