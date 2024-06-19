import PaymentCard from "../payment/PaymentCard.jsx";
import RegisterForm from "../forms/register/RegisterForm.jsx";
import {getSession} from "../../utils/session.jsx";

export default function PrincipalCardContainer() {
    function isUser() {
        const sessionData = getSession()
        return sessionData.role === 'USER';
    }

    function isAdmin() {
        const sessionData = getSession()
        return sessionData.role === 'ADMIN';
    }

    return (
        <div className="dashboard-container" style={{textAlign: 'center'}}>
            <div className="dashboard-section">
                {isUser() && <PaymentCard/>}
                {isAdmin() && <RegisterForm/>}
            </div>
        </div>
    )
}