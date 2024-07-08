import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Menubar} from 'primereact/menubar';
import PrincipalCardContainer from "../../components/card/PrincipalCardContainer.jsx";
import InternalDialog from "../../components/dialog/InternalDialog.jsx";
import {start, useEnd, useMenuItems} from "../../components/menu/MenuItemData.jsx";
import {hasSession} from "../../utils/session.jsx";
import './Dashboard.css'
import background from "/Shotokan_Fondo.svg";
import useSavePurchase from "../../hooks/useSavePurchase.js";

export default function Dashboard() {
    const [visible, setVisible] = useState(false)
    const params = new URLSearchParams(useLocation().search);
    const [state,setState] = useState("");
    const [meetId,setMeetId] = useState("");
    const [userId,setUserId] = useState("");
    const navigate = useNavigate();
    const menuItems = useMenuItems()
    const end = useEnd()
    useSavePurchase(state === 'succeeded', meetId, userId)

    const handleDialogClose = () => {
        setVisible(false)
    }
    useEffect(() => {
        if (!hasSession()) {
            navigate('/virtual-dojo/frontend/login')
        }
        setMeetId(params.get('meetId'))
        setUserId(params.get('userId'))
        setState(params.get('state'))
    }, [navigate])

    return (
        <div>
            <Menubar model={menuItems} start={start} end={end}/>
            <PrincipalCardContainer/>
            <div>
                {state === 'succeeded' && <InternalDialog  isVisible={true} onClose={handleDialogClose}  title="Pago exitoso" message="Gracias por su compra"/>}
                {state === 'canceled' && <InternalDialog isVisible={true} onClose={handleDialogClose} title="Pago cancelado" message="Lo sentimos, su pago no pudo ser procesado"/>}
            </div>
        </div>
    )
}
