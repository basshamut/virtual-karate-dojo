import {useNavigate} from "react-router-dom"
import {Button} from "primereact/button";

export const useMenuItems = () => {
    const navigate = useNavigate();
    return [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => {
                navigate('/dashboard')
            }
        },
        {
            label: 'Productos',
            icon: 'pi pi-shopping-cart',
            command: () => {
                navigate('/dashboard') //TODO ver hacia donde va redirigirse
            }
        }
    ];
};

export const start = <img alt="logo" src="/Shotokan_Logo.svg" height="40" className="mr-2"></img>;
export const useEnd = () => {
    const navigate = useNavigate();
    const closeSession = () => {
        navigate("/")
    }

    return (
        <div className="flex align-items-center gap-2">
            <Button label="Cerrar sesión" onClick={closeSession} className="custom-button"/>
        </div>
    )
}