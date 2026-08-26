import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import db from "../config/sqlite.js";

const reportData = query => {
    const conditions = [], values = [];
    const productId = Number(query.productId);
    if (Number.isInteger(productId) && productId > 0) { conditions.push("m.product_id = ?"); values.push(productId); }
    if (query.type) { conditions.push("m.movement_type = ?"); values.push(String(query.type).trim()); }
    if (query.from) { conditions.push("date(m.created_at) >= date(?)"); values.push(String(query.from)); }
    if (query.to) { conditions.push("date(m.created_at) <= date(?)"); values.push(String(query.to)); }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const movements = db.prepare(`SELECT m.id,m.created_at AS createdAt,p.name AS product,p.category,
        m.movement_type AS movementType,m.quantity,m.reference_id AS referenceId,m.note,
        COALESCE(m.performed_by,'SYSTEM') AS performedBy FROM inventory_movements m
        JOIN products p ON p.id=m.product_id ${where} ORDER BY m.id DESC`).all(...values);
    const inventory = db.prepare(`SELECT p.name AS product,p.category,i.total_produced AS totalProduced,
        i.total_sold AS totalSold,i.quantity_available AS available,i.reserved_quantity AS reserved,
        i.low_stock_threshold AS lowStockThreshold FROM inventory i JOIN products p ON p.id=i.product_id
        ${Number.isInteger(productId) && productId > 0 ? "WHERE i.product_id=?" : ""} ORDER BY p.name`).all(...(Number.isInteger(productId) && productId > 0 ? [productId] : []));
    return { movements, inventory };
};

const filenameDate = () => new Date().toISOString().slice(0,10);

export const exportInventoryExcel = async (req, res) => {
    try {
        const { movements, inventory } = reportData(req.query);
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "NutriDust Foods";
        workbook.created = new Date();
        const ledger = workbook.addWorksheet("Movement Ledger", { views:[{ state:"frozen", ySplit:4 }] });
        ledger.mergeCells("A1:I1");
        ledger.getCell("A1").value = "NutriDust Foods - Inventory Movement Ledger";
        ledger.getCell("A1").font = { bold:true, size:16, color:{ argb:"FFFFFFFF" } };
        ledger.getCell("A1").fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF173C25" } };
        ledger.getCell("A2").value = "Generated";
        ledger.getCell("B2").value = new Date();
        ledger.getCell("B2").numFmt = "yyyy-mm-dd hh:mm";
        ledger.addRow([]);
        const header = ledger.addRow(["Date","Product","Category","Movement Type","Quantity","Reference","Note","Performed By","Log ID"]);
        header.font = { bold:true, color:{ argb:"FFFFFFFF" } };
        header.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF25864C" } };
        movements.forEach(row => ledger.addRow([new Date(`${String(row.createdAt).replace(" ","T")}Z`),row.product,row.category,row.movementType,Number(row.quantity),row.referenceId||"",row.note||"",row.performedBy,row.id]));
        ledger.getColumn(1).numFmt = "yyyy-mm-dd hh:mm:ss";
        [18,28,18,18,12,14,55,28,10].forEach((width,index)=>ledger.getColumn(index+1).width=width);
        ledger.autoFilter = { from:"A4", to:"I4" };
        ledger.eachRow((row,index)=>{ if(index>4 && index%2===1) row.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFF1F6F2"}}; row.alignment={vertical:"top",wrapText:true}; });
        const summary = workbook.addWorksheet("Stock Summary", { views:[{ state:"frozen", ySplit:3 }] });
        summary.mergeCells("A1:G1"); summary.getCell("A1").value="Current Inventory Summary"; summary.getCell("A1").font={bold:true,size:16,color:{argb:"FFFFFFFF"}}; summary.getCell("A1").fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF173C25"}};
        const summaryHeader=summary.addRow(["Product","Category","Produced","Sold","Available","Reserved","Low Stock Threshold"]); summaryHeader.font={bold:true,color:{argb:"FFFFFFFF"}}; summaryHeader.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF25864C"}};
        inventory.forEach(row=>summary.addRow([row.product,row.category,row.totalProduced,row.totalSold,row.available,row.reserved,row.lowStockThreshold]));
        [30,18,14,14,14,14,20].forEach((width,index)=>summary.getColumn(index+1).width=width);
        summary.autoFilter={from:"A2",to:"G2"};
        res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition",`attachment; filename="nutridust-inventory-${filenameDate()}.xlsx"`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) { if(!res.headersSent) res.status(500).json({success:false,message:"Unable to export inventory Excel report."}); }
};

export const exportInventoryPdf = (req, res) => {
    try {
        const { movements, inventory } = reportData(req.query);
        const doc = new PDFDocument({ size:"A4", layout:"landscape", margin:35, bufferPages:true, info:{Title:"NutriDust Inventory Ledger"} });
        res.setHeader("Content-Type","application/pdf");
        res.setHeader("Content-Disposition",`attachment; filename="nutridust-inventory-${filenameDate()}.pdf"`);
        doc.pipe(res);
        const widths=[92,110,75,80,48,68,230,105], startX=35;
        const drawHeader=()=>{doc.fillColor("#173c25").fontSize(18).font("Helvetica-Bold").text("NutriDust Foods - Inventory Movement Ledger",35,30);doc.fillColor("#59645d").fontSize(8).font("Helvetica").text(`Generated ${new Date().toLocaleString("en-NG",{timeZone:"Africa/Lagos"})}`,35,54);let x=startX;const y=72;doc.rect(35,y,771,22).fill("#25864c");doc.fillColor("white").font("Helvetica-Bold").fontSize(7);["Date","Product","Category","Type","Qty","Reference","Note","Performed By"].forEach((label,i)=>{doc.text(label,x+3,y+7,{width:widths[i]-6});x+=widths[i];});return 96;};
        let y=drawHeader();
        movements.forEach((row,index)=>{const cells=[new Date(`${String(row.createdAt).replace(" ","T")}Z`).toLocaleString("en-NG",{timeZone:"Africa/Lagos"}),row.product,row.category,row.movementType,String(row.quantity),row.referenceId||"",row.note||"",row.performedBy];const height=Math.max(28,...cells.map((cell,i)=>doc.heightOfString(String(cell),{width:widths[i]-6})))+7;if(y+height>525){doc.addPage();y=drawHeader();}if(index%2===0)doc.rect(35,y,771,height).fill("#f1f6f2");let x=startX;doc.fillColor("#17221b").font("Helvetica").fontSize(7);cells.forEach((cell,i)=>{doc.text(String(cell),x+3,y+4,{width:widths[i]-6});x+=widths[i];});doc.moveTo(35,y+height).lineTo(806,y+height).strokeColor("#dce6de").stroke();y+=height;});
        if(!movements.length)doc.fillColor("#59645d").fontSize(11).text("No inventory movements matched the selected filters.",35,110);
        doc.addPage({size:"A4",layout:"landscape",margin:35});doc.fillColor("#173c25").font("Helvetica-Bold").fontSize(18).text("Current Stock Summary");doc.moveDown();inventory.forEach(row=>{doc.fillColor(Number(row.available)<=Number(row.lowStockThreshold)?"#a42626":"#17221b").fontSize(9).text(`${row.product} | Available: ${row.available} | Reserved: ${row.reserved} | Produced: ${row.totalProduced} | Sold: ${row.totalSold} | Low-stock threshold: ${row.lowStockThreshold}`);doc.moveDown(.35);});
        const pages=doc.bufferedPageRange?.();if(pages){for(let i=pages.start;i<pages.start+pages.count;i++){doc.switchToPage(i);doc.fillColor("#718077").fontSize(7).text(`NutriDust confidential inventory report | Page ${i+1}`,35,548,{width:771,align:"right",lineBreak:false});}}
        doc.end();
    } catch (error) { if(!res.headersSent) res.status(500).json({success:false,message:"Unable to export inventory PDF report."}); }
};
