import {start, useEnd, useMenuItems} from "../../components/menu/MenuItemData";
import {Menubar} from 'primereact/menubar';
import './Dashboard.css'
import PrincipalCardContainer from "../../components/card/PrincipalCardContainer.jsx";

export default function Dashboard() {
    const menuItems = useMenuItems()
    const end = useEnd()

    return (
        <>
            <Menubar model={menuItems} start={start} end={end}/>
            <PrincipalCardContainer/>
        </>
    )
}
