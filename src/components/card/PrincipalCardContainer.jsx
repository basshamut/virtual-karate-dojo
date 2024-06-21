export default function PrincipalCardContainer() {
    const [meets, setMeets] = useState([])

    function isUser() {
        const sessionData = getSession()
        return sessionData.role === 'USER';
    }

    function isAdmin() {
        const sessionData = getSession()
        return sessionData.role === 'ADMIN';
    }

    useEffect(() => {
        async function fetchMeets() {
            try {
                const response = await fetch('http://localhost:5000/api/meets/all')
                const meets = await response.json()
                console.log('Meets:', meets)
                setMeets(meets || [])
            } catch (error) {
                console.error('Error fetching meets:', error)
            }
        }

        fetchMeets()
    }, [])

    return (
        <>
            {isUser() &&
                <div className="dashboard-container" style={{textAlign: 'center'}}>
                    {meets.map((meet) => (
                        <div className="dashboard-section" key={meet.id}>
                            <PaymentCard key={meet.id} meet={meet}/>
                        </div>
                    ))}
                </div>
            }
            {isAdmin() &&
                <div className="dashboard-container" style={{textAlign: 'center'}}>
                    <div className="dashboard-section">
                        <RegisterForm/>
                    </div>
                </div>
            }
        </>
    )
}
import PaymentCard from "../payment/PaymentCard.jsx";
import RegisterForm from "../forms/register/RegisterForm.jsx";
import {getSession} from "../../utils/session.jsx";

import {useEffect, useState} from "react";
