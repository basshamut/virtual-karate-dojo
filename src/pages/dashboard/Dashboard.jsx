import {start, useEnd, useMenuItems} from "../../components/menu/MenuItemData";
import {Menubar} from 'primereact/menubar';
import './Dashboard.css'
import PrincipalCardContainer from "../../components/card/PrincipalCardContainer.jsx";
import background from "/Shotokan_Fondo.svg";
import {useLocation} from "react-router-dom";
import {useState} from "react";
import InternalDialog from "../../components/dialog/InternalDialog.jsx";

export default function Dashboard() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [state,setState] = useState(params.get('state'));

    const menuItems = useMenuItems()
    const end = useEnd()

    const [visible, setVisible] = useState(false)

    const handleDialogClose = () => {
        setVisible(false)
    }

    return (
        <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', height: '100vh' }}>
            <Menubar model={menuItems} start={start} end={end}/>
            <PrincipalCardContainer/>
            <div>
                {state === 'succeeded' && <InternalDialog  isVisible={true} onClose={handleDialogClose}  title="Pago exitoso" message="Gracias por su compra"/>}
                {state === 'canceled' && <InternalDialog isVisible={true} onClose={handleDialogClose} title="Pago cancelado" message="Lo sentimos, su pago no pudo ser procesado"/>}
            </div>
        </div>
    )
}
