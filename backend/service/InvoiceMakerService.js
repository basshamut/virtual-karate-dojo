const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function generateInvoicePdf(invoiceData) {
  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { height } = page.getSize();
  const fontSize = 12;

  // Cargar la fuente estándar Times Roman
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Añadir encabezado de la factura
  page.drawText('Factura', {
    x: 50,
    y: height - 40,
    size: 20,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`ID de la compra: ${invoiceData.id}`, {
    x: 50,
    y: height - 70,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Fecha de la compra: ${invoiceData.purchaseDate}`, {
    x: 50,
    y: height - 90,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Total: ${invoiceData.price}€`, {
    x: 50,
    y: height - 110,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  // Añadir tabla de productos
  const tableStartY = height - 150;
  const rowHeight = 20;
  let y = tableStartY;

  // Encabezados de la tabla
  page.drawText('Producto', {
    x: 50,
    y,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  page.drawText('Cantidad', {
    x: 250,
    y,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  page.drawText('Costo', {
    x: 400,
    y,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  // Dibujar una línea debajo de los encabezados
  y -= 10;
  page.drawLine({
    start: { x: 50, y },
    end: { x: 500, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= 10;

  // Filas de la tabla
  invoiceData.items.forEach(item => {
    page.drawText(item.product, {
      x: 50,
      y,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(item.quantity.toString(), {
      x: 250,
      y,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(item.cost.toString() + "€", {
      x: 400,
      y,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    y -= rowHeight;
  });

  return await pdfDoc.save();
}

module.exports = { generateInvoicePdf };
