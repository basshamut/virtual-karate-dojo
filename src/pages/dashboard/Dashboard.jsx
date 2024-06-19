import {start, useEnd, useMenuItems} from "../../components/menu/MenuItemData";
import {Menubar} from 'primereact/menubar';
import './Dashboard.css'
import PrincipalCardContainer from "../../components/card/PrincipalCardContainer.jsx";
import background from "/Shotokan_Fondo.svg";
import {useLocation} from "react-router-dom";
import {useState} from "react";

export default function Dashboard() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [state,setState] = useState(params.get('state'));

    console.log(params)
    console.log(state)

    const menuItems = useMenuItems()
    const end = useEnd()

    return (
        <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', height: '100vh' }}>
            <Menubar model={menuItems} start={start} end={end}/>
            <PrincipalCardContainer/>
            <div>
                {/*TODO Implementar lógica estado del pago*/}
                {state === 'succeeded' && <p>Pago exitoso</p>}
                {state === 'canceled' && <p>Pago cancelado</p>}
            </div>
        </div>
    )
}
