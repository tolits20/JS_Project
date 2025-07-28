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
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.5; 
      color: #000; 
      background-color: #f8f8f8;
      margin: 0;
      padding: 20px;
    }
    .container { 
      max-width: 650px; 
      margin: 0 auto; 
      background-color: #ffffff;
      border: 2px solid #000;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .header { 
      background-color: #000; 
      padding: 30px; 
      text-align: center;
      border-bottom: 3px solid #000;
    }
    .header h1 { 
      color: #fff; 
      margin: 0; 
      font-size: 28px; 
      font-weight: 300;
      letter-spacing: 3px;
    }
    .content { 
      padding: 30px; 
      background-color: #ffffff; 
    }
    .order-info { 
      margin-bottom: 25px; 
      text-align: center;
    }
    .receipt-title { 
      color: #000; 
      font-size: 22px; 
      margin-bottom: 8px; 
      font-weight: 600;
    }
    .order-number { 
      color: #666; 
      font-size: 16px; 
      margin-bottom: 25px;
      font-weight: 400;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 25px 0;
      border: 1px solid #000;
    }
    th { 
      background-color: #000; 
      color: #fff;
      text-align: left; 
      padding: 15px 12px; 
      font-weight: 600; 
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    td { 
      padding: 15px 12px; 
      border-bottom: 1px solid #ddd;
      font-size: 15px;
    }
    tr:nth-child(even) { 
      background-color: #f9f9f9; 
    }
    tr:hover {
      background-color: #f0f0f0;
    }
    .text-center { 
      text-align: center; 
    }
    .text-right { 
      text-align: right; 
      font-weight: 500;
    }
    .total-section {
      margin-top: 30px;
      padding: 20px;
      background-color: #f9f9f9;
      border: 2px solid #000;
      border-radius: 0;
    }
    .total { 
      font-weight: 700; 
      font-size: 24px; 
      color: #000; 
      text-align: right;
      margin: 0;
      letter-spacing: 1px;
    }
    .footer { 
      background-color: #000; 
      color: #fff;
      padding: 20px; 
      text-align: center; 
      font-size: 13px;
      border-top: 3px solid #000;
    }
    .divider { 
      height: 2px; 
      background-color: #000; 
      margin: 25px 0; 
    }
    .thank-you {
      margin-top: 25px;
      padding: 20px;
      text-align: center;
      background-color: #f9f9f9;
      border-left: 4px solid #000;
    }
    .thank-you p {
      margin: 8px 0;
      color: #333;
      font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>RECEIPT</h1>
    </div>
    
    <div class="content">
      <div class="order-info">
        <div class="receipt-title">Order Summary</div>
        <div class="order-number">Order #${order.id} | ${order.date}</div>
        <div class="divider"></div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ITEM DESCRIPTION</th>
            <th class="text-center">QTY</th>
            <th class="text-right">UNIT PRICE</th>
            <th class="text-right">SUBTOTAL</th>
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
      
      <div class="total-section">
        <div class="total">
          TOTAL: ₱${order.total.toFixed(2)}
        </div>
      </div>
      
      <div class="thank-you">
        <p><strong>Thank you for your business!</strong></p>
        <p>Your receipt has been generated and saved for your records.</p>
        <p>For any inquiries, please contact our customer service team.</p>
      </div>
    </div>
    
    <div class="footer">
      © ${new Date().getFullYear()} Your Business Name • All Rights Reserved • Thank You for Shopping With Us
    </div>
  </div>
</body>
</html>`;

  // Email Sending
  const pdfBuffer = await pdfPromise;
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e509c19b79c43f",
      pass: "3c8faa3dbd9d17",
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
}

module.exports = { sendEmail };