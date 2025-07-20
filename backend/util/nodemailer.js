const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

async function sendEmail(items) {
  // Transform items to match expected structure
  const transformedItems = items.map(item => ({
    name: item.item_name,
    qty: item.quantity,
    price: item.item_price
  }));

  const order = {
    id: "ORD-9023",
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: transformedItems,
    // Calculate total
    get total() {
      return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
  };

  const doc = new PDFDocument({ 
    size: 'A5',
    margin: 40,
    bufferPages: true 
  });
  
  // Collect PDF chunks
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  const pdfPromise = new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  // PDF Styling
  const primaryColor = '#2c3e50';
  const secondaryColor = '#7f8c8d';
  const accentColor = '#e74c3c';
  const lightGray = '#f5f5f5';
  const borderColor = '#e0e0e0';

  // Header
  doc.fillColor(primaryColor)
     .fontSize(20)
     .text('ORDER RECEIPT', { align: 'center' })
     .moveDown(0.3)
     .fontSize(10)
     .fillColor(secondaryColor)
     .text(`Order #${order.id} | ${order.date}`, { align: 'center' });

  // Divider line
  doc.moveTo(40, doc.y + 10)
     .lineTo(doc.page.width - 40, doc.y + 10)
     .strokeColor(borderColor)
     .lineWidth(1)
     .stroke()
     .moveDown(1);

  // Items Table Header
  const tableTop = doc.y;
  const col1 = 40;
  const col2 = doc.page.width - 170;
  const col3 = doc.page.width - 90;
  const col4 = doc.page.width - 40;

  // Table Header Background
  doc.rect(col1, tableTop, col4 - col1, 20)
     .fill(lightGray);

  // Table Header Text
  doc.font('Helvetica-Bold')
     .fillColor(primaryColor)
     .fontSize(9)
     .text('ITEM', col1, tableTop + 5)
     .text('QTY', col2, tableTop + 5, { width: 40, align: 'center' })
     .text('PRICE', col3, tableTop + 5, { width: 40, align: 'right' })
     .text('TOTAL', col4, tableTop + 5, { align: 'right' });

  // Table Rows
  let y = tableTop + 20;
  order.items.forEach((item, i) => {
    // Alternate row colors
    if (i % 2 === 0) {
      doc.rect(col1, y, col4 - col1, 20)
         .fill('#ffffff');
    } else {
      doc.rect(col1, y, col4 - col1, 20)
         .fill(lightGray);
    }

    doc.font('Helvetica')
       .fillColor(primaryColor)
       .fontSize(9)
       .text(item.name, col1, y + 5)
       .text(item.qty.toString(), col2, y + 5, { width: 40, align: 'center' })
       .text(`${item.price.toFixed(2)}`, col3, y + 5, { width: 40, align: 'right' })
       .text(`${(item.price * item.qty).toFixed(2)}`, col4, y + 5, { align: 'right' });

    y += 20;
  });

  // Table Bottom Border
  doc.moveTo(col1, y)
     .lineTo(col4, y)
     .strokeColor(borderColor)
     .lineWidth(1)
     .stroke();

  // Total Section
  doc.font('Helvetica-Bold')
     .fillColor(accentColor)
     .fontSize(11)
     .text('Total:', doc.page.width - 140, y + 20, { align: 'right' })
     .text(`${order.total.toFixed(2)}`, doc.page.width - 40, y + 20, { align: 'right' });

  // Footer
  doc.moveDown(3);
  doc.fontSize(8)
     .fillColor(secondaryColor)
     .text('Thank you for your purchase!', { align: 'center' });

  doc.end();

  // ... (keep all the previous PDF generation code the same until the email section)

  // Email Content with improved styling
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
        .header { background-color: #2c3e50; padding: 25px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 25px; background-color: #ffffff; }
        .order-info { margin-bottom: 20px; }
        .receipt-title { color: #2c3e50; font-size: 20px; margin-bottom: 5px; }
        .order-number { color: #7f8c8d; font-size: 14px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f5f5f5; text-align: left; padding: 12px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #e0e0e0; }
        td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .total { font-weight: bold; font-size: 16px; color: #e74c3c; margin-top: 20px; text-align: right; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #7f8c8d; }
        .divider { height: 1px; background-color: #e0e0e0; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ORDER RECEIPT</h1>
        </div>
        
        <div class="content">
          <div class="order-info">
            <div class="receipt-title">Your Order Details</div>
            <div class="order-number">Order #${order.id} | ${order.date}</div>
            <div class="divider"></div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th class="text-center">QTY</th>
                <th class="text-right">PRICE</th>
                <th class="text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-center">${item.qty}</td>
                  <td class="text-right">₱${item.price.toFixed(2)}</td>
                  <td class="text-right">₱${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            Total: $${order.total.toFixed(2)}
          </div>
          
          <div class="divider"></div>
          
          <p>Thank you for your purchase! A detailed receipt is attached to this email.</p>
          <p>If you have any questions about your order, please contact our support team.</p>
        </div>
        
        <div class="footer">
          © ${new Date().getFullYear()} Your Store Name. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  // Email Sending
  const pdfBuffer = await pdfPromise;
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9aee35dd6bb259",
      pass: "3d1973a36c39e0",
    },
  });

  const mailOptions = {
    from: '"Your Store" <orders@yourstore.com>',
    to: 'recipient@example.com', // Replace with actual recipient
    subject: `Your Receipt for Order #${order.id}`,
    html: htmlContent,
    attachments: [{
      filename: `receipt-${order.id}.pdf`,
      content: pdfBuffer,
      contentType: "application/pdf",
    }],
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Receipt sent with styled email!");
}

module.exports = { sendEmail };