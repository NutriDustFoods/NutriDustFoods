import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import db from "../config/sqlite.js";

const filenameDate = () => new Date().toISOString().slice(0, 10);
const itemsText = value => {
    try {
        const items = JSON.parse(value || "[]");
        return items.map(item => `${item.name || `Product ${item.productId || ""}`} x${Number(item.quantity || 1)}`).join(", ");
    } catch { return ""; }
};

const reportData = query => {
    const conditions = [], values = [];
    const search = String(query.search || "").trim().toLowerCase();
    const payment = String(query.payment || "all").trim().toLowerCase();
    const status = String(query.status || "all").trim().toLowerCase();
    if (search) {
        conditions.push("(CAST(id AS TEXT) LIKE ? OR lower(customer_name) LIKE ? OR lower(customer_email) LIKE ? OR customer_phone LIKE ?)");
        const term = `%${search}%`;
        values.push(term, term, term, term);
    }
    if (payment !== "all") { conditions.push("lower(payment_status) = ?"); values.push(payment); }
    if (status !== "all") { conditions.push("lower(order_status) = ?"); values.push(status); }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    return db.prepare(`SELECT id,customer_name,customer_phone,customer_email,delivery_address,fulfillment_type,
        delivery_fee,items,total_amount,payment_status,order_status,payment_reference,created_at
        FROM orders ${where} ORDER BY id DESC`).all(...values).map(row => ({ ...row, itemsSummary:itemsText(row.items) }));
};

const filterDescription = query => [
    query.search ? `Search: ${query.search}` : null,
    query.payment && query.payment !== "all" ? `Payment: ${query.payment}` : null,
    query.status && query.status !== "all" ? `Status: ${query.status}` : null
].filter(Boolean).join(" | ") || "All order records";

export const exportOrdersExcel = async (req, res) => {
    try {
        const orders = reportData(req.query), workbook = new ExcelJS.Workbook();
        workbook.creator = "NutriDust Foods";
        const sheet = workbook.addWorksheet("Order Records", { views:[{ state:"frozen", ySplit:5 }] });
        sheet.mergeCells("A1:N1");
        sheet.getCell("A1").value = "NutriDust Foods - Order Records";
        sheet.getCell("A1").font = { bold:true, size:17, color:{argb:"FFFFFFFF"} };
        sheet.getCell("A1").fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FF111519"} };
        sheet.getCell("A2").value = "Generated"; sheet.getCell("B2").value = new Date(); sheet.getCell("B2").numFmt = "yyyy-mm-dd hh:mm";
        sheet.getCell("A3").value = "Filters"; sheet.getCell("B3").value = filterDescription(req.query);
        const header = sheet.addRow(["Order","Date","Customer","Phone","Email","Items","Fulfilment","Delivery Address","Subtotal","Delivery Fee","Total","Payment","Order Status","Reference"]);
        header.font = { bold:true, color:{argb:"FFFFFFFF"} };
        header.fill = { type:"pattern", pattern:"solid", fgColor:{argb:"FFFF9418"} };
        orders.forEach(row => sheet.addRow([`#${row.id}`,new Date(`${String(row.created_at).replace(" ","T")}Z`),row.customer_name,row.customer_phone,row.customer_email,row.itemsSummary,row.fulfillment_type,row.delivery_address,Number(row.total_amount)-Number(row.delivery_fee||0),Number(row.delivery_fee||0),Number(row.total_amount),row.payment_status,row.order_status,row.payment_reference||""]));
        [10,20,24,16,28,45,14,42,14,14,14,14,18,26].forEach((width,index)=>sheet.getColumn(index+1).width=width);
        sheet.getColumn(2).numFmt = "yyyy-mm-dd hh:mm:ss";
        [9,10,11].forEach(index=>sheet.getColumn(index).numFmt='₦#,##0.00');
        sheet.autoFilter = { from:"A4", to:"N4" };
        sheet.eachRow((row,index)=>{row.alignment={vertical:"top",wrapText:true};if(index>4&&index%2===1)row.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFF6F2EA"}};});
        res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition",`attachment; filename="nutridust-orders-${filenameDate()}.xlsx"`);
        await workbook.xlsx.write(res); res.end();
    } catch (error) { console.error("Order Excel export failed:",error); if(!res.headersSent)res.status(500).json({success:false,message:"Unable to export order Excel report."}); }
};

export const exportOrdersPdf = (req, res) => {
    try {
        const orders = reportData(req.query);
        const doc = new PDFDocument({ size:"A4", layout:"landscape", margin:30, bufferPages:true, info:{Title:"NutriDust Order Records"} });
        res.setHeader("Content-Type","application/pdf");
        res.setHeader("Content-Disposition",`attachment; filename="nutridust-orders-${filenameDate()}.pdf"`);
        doc.pipe(res);
        const widths=[38,70,100,78,52,55,58,62,218,62], labels=["Order","Date","Customer","Phone","Total","Payment","Status","Delivery","Items / Address","Reference"], startX=30;
        const heading=()=>{doc.fillColor("#ff9418").font("Helvetica-Bold").fontSize(18).text("NutriDust Foods - Order Records",30,25);doc.fillColor("#9aa2a8").font("Helvetica").fontSize(8).text(`${filterDescription(req.query)} | Generated ${new Date().toLocaleString("en-NG",{timeZone:"Africa/Lagos"})}`,30,49);let x=startX;doc.rect(startX,66,793,22).fill("#171c21");doc.fillColor("white").font("Helvetica-Bold").fontSize(7);labels.forEach((label,index)=>{doc.text(label,x+3,73,{width:widths[index]-6});x+=widths[index];});return 90;};
        let y=heading();
        orders.forEach((row,index)=>{const address=`${row.itemsSummary}\n${row.delivery_address||""}`,cells=[`#${row.id}`,new Date(`${String(row.created_at).replace(" ","T")}Z`).toLocaleString("en-NG",{timeZone:"Africa/Lagos"}),row.customer_name,row.customer_phone,`N${Number(row.total_amount).toLocaleString("en-NG")}`,row.payment_status,row.order_status,row.fulfillment_type,address,row.payment_reference||""];const height=Math.max(29,...cells.map((cell,i)=>doc.heightOfString(String(cell),{width:widths[i]-6})))+7;if(y+height>535){doc.addPage();y=heading();}if(index%2===0)doc.rect(startX,y,793,height).fill("#f6f2ea");let x=startX;doc.fillColor("#15191c").font("Helvetica").fontSize(7);cells.forEach((cell,i)=>{doc.text(String(cell),x+3,y+4,{width:widths[i]-6});x+=widths[i];});y+=height;});
        if(!orders.length)doc.fillColor("#5f6870").fontSize(11).text("No orders matched the selected filters.",30,110);
        const pages=doc.bufferedPageRange();for(let i=pages.start;i<pages.start+pages.count;i++){doc.switchToPage(i);doc.fillColor("#7a8288").fontSize(7).text(`NutriDust confidential order report | Page ${i+1}`,30,555,{width:793,align:"right",lineBreak:false});}
        doc.end();
    } catch (error) { console.error("Order PDF export failed:",error); if(!res.headersSent)res.status(500).json({success:false,message:"Unable to export order PDF report."}); }
};
