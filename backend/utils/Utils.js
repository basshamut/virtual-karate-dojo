const PDFDocument = require('pdfkit');
const Utils = {};

Utils.createInvoicePDF = (invoiceData) => {
    return new Promise((resolve, reject) => {
        try {
            // Create a new PDF document
            const doc = new PDFDocument({margin: 50});
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData.toString('base64'));
            });

            // Header
            doc.fontSize(20).text('Mushin Dojo', {align: 'left'});
            doc.fontSize(10).text('C/VISTALEGRE 91-93 08940 CORNELLA DE LLOBREGAT (TRAM PADRÓ) Barcelona', {align: 'left'});

            // Space
            doc.moveDown();

            // Billing and Shipping Information
            doc.fontSize(12).text('Facturar a', 50, 120);
            doc.fontSize(10).text(invoiceData.billTo, 50, 135);

            // Invoice Details
            doc.fontSize(10)
                .text(`N° de factura: ${invoiceData.invoiceNumber}`, 400, 200)
                .text(`Fecha: ${invoiceData.date}`, 400, 215)

            // Space before table
            doc.moveDown(2);

            // Table headers
            doc.lineWidth(1).moveTo(50, 280).lineTo(550, 280).stroke();
            doc.fontSize(10)
                .text('CANT.', 50, 265)
                .text('DESCRIPCIÓN', 150, 265)
                .text('MONTO', 370, 265, {align: 'right'})
            doc.moveTo(50, 290).lineTo(550, 290).stroke();

            // Table rows
            let yPos = 300;
            invoiceData.items.forEach((item, i) => {
                doc.fontSize(10)
                    .text(item.quantity, 50, yPos)
                    .text(item.description, 150, yPos)
                    .text((item.quantity * item.unitPrice).toFixed(2), 470, yPos, {align: 'right'});
                yPos += 20;
            });

            // Lines after items
            doc.moveTo(50, yPos + 10).lineTo(550, yPos + 10).stroke();

            // Subtotal, IVA, and total
            doc.fontSize(10)
                .text(`Subtotal`, 370, yPos + 20) // Ajusta la posición horizontal y remueve la alineación
                .text(invoiceData.subtotal.toFixed(2), 470, yPos + 20, {align: 'right'});
            doc.fontSize(12)
                .text(`TOTAL`, 370, yPos + 50) // Ajusta la posición horizontal y remueve la alineación
                .text(invoiceData.total.toFixed(2), 470, yPos + 50, {align: 'right'});

            // End the document
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

Utils.formatDate = function (date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

module.exports = Utils