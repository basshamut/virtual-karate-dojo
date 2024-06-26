import {useNavigate} from "react-router-dom"
import {Button} from "primereact/button";
import {clearSession} from "../../utils/session.jsx";

export const useMenuItems = () => {
    const navigate = useNavigate();
    return [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => {
                navigate('/virtual-dojo/frontend/dashboard')
            }
        }
        //TODO que opciones de menu se podrian agregar?
        // ,
        // {
        //     label: 'Productos',
        //     icon: 'pi pi-shopping-cart',
        //     command: () => {
        //         navigate('/virtual-dojo/frontend/dashboard')
        //     }
        // }
    ];
};

export const start = <img alt="logo" src="Shotokan_Logo.svg" height="40" className="mr-2"></img>;
export const useEnd = () => {
    const navigate = useNavigate();
    const closeSession = () => {
        clearSession()
        navigate("/virtual-dojo/frontend")
    }

    return (
        <div className="flex align-items-center gap-2">
            <Button label="Cerrar sesión" onClick={closeSession} className="custom-button"/>
        </div>
    )
}