import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import './InternalDialog.css'

// eslint-disable-next-line react/prop-types
function InternalDialog({ isVisible, onClose, message, title }) {
    const [visible, setVisible] = useState(isVisible)

    useEffect(() => {
        setVisible(isVisible)
    }, [isVisible])

    const header = (
        <div className="p-d-flex p-ai-center p-jc-between" style={{ width: '100%' }}>
            <span className="p-dialog-title"> {title}  </span>
        </div>
    )

    const footer = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={() => { setVisible(false); onClose() }} />
        </div>
    )

    return (
        <Dialog header={header} visible={visible} style={{ width: '50vw' }} footer={footer} onHide={() => { setVisible(false); onClose() }}>
            <p className="m-0">
                {message}
            </p>
        </Dialog>
    )
}

export default InternalDialog
