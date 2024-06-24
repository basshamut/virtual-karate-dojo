import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {useState} from "react"
import {Calendar} from "primereact/calendar"

export default function MeetRegisterForm() {
    const today = new Date()
    const [date, setDate] = useState(today)
    const [url, setUrl] = useState('')
    const [price, setPrice] = useState(0)
    // const domain = "http://localhost:5000"
    const domain = "http://86.38.204.61"

    function saveMeet() {
        fetch(domain + '/api/meets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({meetUrl: url, meetDate: date, price: price})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(() => {
                setUrl('')
                setDate(today)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error)
            })
    }

    return (
        <div id="register" style={{
            backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div className="inline-flex flex-column gap-2">
                <label htmlFor="url" className="text-primary-50 font-semibold">
                    Dirección de la Reunión Online
                </label>
                <InputText id="url" label="Url" placeholder={"https://meet.google.com/..."}
                           className="bg-white-alpha-20 border-none p-3 text-primary-50"
                           onChange={event => setUrl(event.target.value)} value={url}
                />
            </div>
            <div className="inline-flex flex-column gap-2">
                <label htmlFor="price" className="text-primary-50 font-semibold">
                    Costo (€)
                </label>
                <InputText id="price" label="Costo" placeholder={"0.0"}
                           className="bg-white-alpha-20 border-none p-3 text-primary-50"
                           onChange={event => setPrice(parseFloat(event.target.value))}
                />
            </div>
            <div className="inline-flex flex-column gap-2">
                <label htmlFor="meetDate" className="text-primary-50 font-semibold">
                    Fecha de la Reunión
                </label>
                <Calendar id="meetDate" value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy"
                          minDate={today} showTime hourFormat="24"/>
            </div>
            <div className="flex align-items-center gap-2">
                <Button label="Registrar" onClick={saveMeet} text
                        className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"/>
            </div>
        </div>

    )
}
