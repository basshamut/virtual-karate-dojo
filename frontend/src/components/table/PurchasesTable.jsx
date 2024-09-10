import {useState} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Calendar} from "primereact/calendar";
import 'primereact/resources/themes/saga-blue/theme.css';  // Elige el tema que prefieras
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Button} from "primereact/button";
import useGetPurchases from "../../hooks/useGetPurchases";
import {hasSession, isUser} from "../../utils/session";

export default function PurchasesTable() {
    const userSession = hasSession();
    const isUserValue = isUser();
    const {purchases, error} = useGetPurchases(isUserValue, userSession);
    const [selectedStartDate, setSelectedStartDate] = useState(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState(new Date());

    function searchMeet() {
        console.log('Meet saved');
    }

    return (
        <div className="table-container">
            <div className="flex">
                <div style={{flex: 1, marginRight: '1rem'}}>
                    <Calendar value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.value)}
                              dateFormat="dd/mm/yy" placeholder="Inicio"/>
                </div>
                <div style={{flex: 1, marginRight: '1rem'}}>
                    <Calendar value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.value)}
                              dateFormat="dd/mm/yy" placeholder="Fin"/>
                </div>
                <div style={{flex: 1, marginRight: '1rem'}}>
                    <Button label="Buscar" onClick={searchMeet}/>
                </div>
            </div>
            <div>
                <DataTable value={purchases} paginator rows={4} globalFilterFields={['meetDate']}>
                    <Column field="email" header="Email del Usuario" sortable></Column>
                    <Column field="purchaseDate" header="Fecha de Compra" sortable></Column>
                    <Column field="meetDate" header="Fecha de Clase" sortable></Column>
                    <Column field="price" header="Precio" sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
