import {useState} from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Calendar} from "primereact/calendar";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useGetPurchases from "../../hooks/useGetPurchases";
import {hasSession, isUser} from "../../utils/session";
import {format} from 'date-fns';

export default function PurchasesTable() {
    const userSession = hasSession();
    const isUserValue = isUser();

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    const [selectedStartDate, setSelectedStartDate] = useState(null); // Se inicia como null para no filtrar inicialmente
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const {purchases, totalRecords, error} = useGetPurchases(isUserValue, userSession, page, rowsPerPage, selectedStartDate, selectedEndDate);

    const onPageChange = (event) => {
        setPage(event.page + 1);  // PrimeReact usa índices basados en 0
        setRowsPerPage(event.rows);  // Actualizar el número de filas por página
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Error de fecha';
        }
    };

    const purchaseDateTemplate = (rowData) => {
        return formatDate(rowData.purchaseDate);
    };

    const meetDateTemplate = (rowData) => {
        return formatDate(rowData.meet?.meetDate);
    };

    return (
        <div className="table-container">
            <div className="flex">
                <div style={{flex: 1, marginRight: '1rem'}}>
                    <label><b>Filtro por Fecha de Clase</b> </label>
                </div>
                <div style={{flex: 1, marginRight: '1rem'}}>
                    <Calendar value={selectedStartDate} onChange={(e) => setSelectedStartDate(e.value)}
                              dateFormat="dd/mm/yy" placeholder="Inicio"/>
                </div>
                <div style={{flex: 1, marginRight: '1rem'}}>
                    <Calendar value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.value)}
                              dateFormat="dd/mm/yy" placeholder="Fin"/>
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                {error && <div>Error: {error}</div>} {/* Mostrar error si existe */}
                <DataTable
                    value={purchases}
                    paginator
                    rows={rowsPerPage}
                    totalRecords={totalRecords}
                    onPage={onPageChange}
                    lazy
                    first={(page - 1) * rowsPerPage}
                >
                    <Column field="user.email" header="Email del Usuario" sortable></Column>
                    <Column field="purchaseDate" header="Fecha de Compra" sortable body={purchaseDateTemplate}></Column>
                    <Column field="meet.meetDate" header="Fecha de Clase" sortable body={meetDateTemplate}></Column>
                    <Column field="price" header="Precio" sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}
