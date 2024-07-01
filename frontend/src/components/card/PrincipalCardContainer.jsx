import PaymentCard from "../payment/PaymentCard.jsx"
import MeetRegisterForm from "../forms/meet/MeetRegisterForm.jsx"
import { hasSession, isAdmin, isUser } from "../../utils/session.jsx"
import useFetchMeets from '../../hooks/useFetchMeets.js'

export default function PrincipalCardContainer() {
    const userSession = hasSession()
    const isUserValue = isUser()
    const isAdminValue = isAdmin()
    const { meets, error } = useFetchMeets(isUserValue, userSession)

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div className="card flex justify-content-center background-image">
            {isUserValue && (
                <div className="dashboard-container" style={{ textAlign: 'center' }}>
                    {meets.map((meet) => (
                        <div className="dashboard-section" key={meet.id}>
                            <PaymentCard key={meet.id} meet={meet} />
                        </div>
                    ))}
                </div>
            )}
            {isAdminValue && (
                <div className="dashboard-container" style={{ textAlign: 'center' }}>
                    <div className="dashboard-section">
                        <MeetRegisterForm />
                    </div>
                </div>
            )}
        </div>
    )
}
