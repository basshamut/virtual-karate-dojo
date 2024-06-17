import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useState} from "react";
import {Calendar} from "primereact/calendar";

export default function RegisterForm() {
    const today = new Date();
    const [date, setDate] = useState(today)
    return (
        <div className="flex flex-column px-8 py-5 gap-4" style={{
            borderRadius: '12px',
            backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))'
        }}>
            <div className="inline-flex flex-column gap-2">
                <label htmlFor="url" className="text-primary-50 font-semibold">
                    Meet Url
                </label>
                <InputText id="url" label="Url"
                           className="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
            </div>
            <div className="inline-flex flex-column gap-2">
                <label htmlFor="meetDate" className="text-primary-50 font-semibold">
                    Meet Date
                </label>
                <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" minDate={today}/>
            </div>
            <div className="flex align-items-center gap-2">
                <Button label="Register Meet" onClick={() => alert('Registrar action')} text
                        className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
            </div>
        </div>
    )
}