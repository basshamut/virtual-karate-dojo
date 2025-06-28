import {useNavigate} from "react-router-dom"
import {Button} from "primereact/button";
import {clearSession, isAdmin} from "../../utils/session.jsx";

export const useMenuItems = () => {
    const navigate = useNavigate();
    const isAdminValue = isAdmin();
    
    const menuItems = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => {
                navigate('/dashboard')
            }
        }
    ];

    // Agregar opción de crear clase solo para administradores
    if (isAdminValue) {
        menuItems.push({
            label: 'Crear Nueva Clase',
            icon: 'pi pi-plus-circle',
            command: () => {
                // Disparar un evento personalizado que será escuchado en el dashboard
                window.dispatchEvent(new CustomEvent('openCreateClassModal'));
            }
        });
    }

    return menuItems;
};

export const start = <img alt="logo" src="https://res.cloudinary.com/di7qko5q9/image/upload/v1727294772/karate-classes/sxgzokc8mysthpctbiir.png" height="40" className="mr-2"></img>;
export const useEnd = () => {
    const navigate = useNavigate();
    const closeSession = () => {
        clearSession()
        navigate('/')
    }

    return (
        <div className="flex align-items-center gap-2">
            <Button label="Cerrar sesión" onClick={closeSession} className="custom-button"/>
        </div>
    )
}