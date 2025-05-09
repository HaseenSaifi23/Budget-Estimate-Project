// window.onload = function () {
//     let container = document.getElementById("calculationContainer");

//     let columnHoursData = JSON.parse(
// .getItem("columnHoursData")) || [];
//     let costData = JSON.parse(localStorage.getItem("costData")) || {};

//     if (columnHoursData.length === 0) {
//         container.innerHTML = "<p>No data available</p>";
//         return;
//     }

//  
//     let percentageTable = document.createElement("table");
//     percentageTable.setAttribute("border", "1");
//     percentageTable.classList.add("result-table");

//     let thead = document.createElement("thead");
//     let headerRow = document.createElement("tr");
//     headerRow.innerHTML = `<th>TEAM</th>` + columnHoursData.map(entry => `<th>${entry.column}</th>`).join("") + `<th>TOTAL</th>`;
//     thead.appendChild(headerRow);
//     percentageTable.appendChild(thead);

//     let tbody = document.createElement("tbody");
//     let hoursRow = document.createElement("tr");
//     hoursRow.innerHTML = `<td>PERCENTAGE</td>` + columnHoursData.map(entry => `<td>${entry.hours}</td>`).join("") + `<td>100%</td>`;
//     tbody.appendChild(hoursRow);
//     percentageTable.appendChild(tbody);

//     container.appendChild(percentageTable);

//     let costTable = document.createElement("table");
//     costTable.setAttribute("border", "1");
//     costTable.classList.add("result-table");

//     let costThead = document.createElement("thead");
//     let costHeaderRow = document.createElement("tr");
//     costHeaderRow.innerHTML = `<th>TEAM</th>` + Object.keys(costData).map(header => `<th>${header}</th>`).join("") + `<th>TOTAL COST</th>`;
//     costThead.appendChild(costHeaderRow);
//     costTable.appendChild(costThead);

//     let costTbody = document.createElement("tbody");
//     let costRow = document.createElement("tr");
//     costRow.innerHTML = `<td>COST</td>` + Object.values(costData).map(cost => `<td>$${cost}</td>`).join("");

//     let totalCost = Object.values(costData).reduce((sum, value) => sum + value, 0);
//     costRow.innerHTML += `<td>$${totalCost}</td>`;
//     costTbody.appendChild(costRow);
//     costTable.appendChild(costTbody);

//     container.appendChild(costTable);
// };




window.onload = function () {

    let container = document.getElementById("calculationContainer");



    
    let columnHoursData = JSON.parse(sessionStorage.getItem("columnHoursData")) || [];
    let costData = JSON.parse(sessionStorage.getItem("costData")) || {};
    let columnTotals = JSON.parse(sessionStorage.getItem("columnTotals")) || {}; 

    console.log(columnHoursData, "columnHoursData=======================");    
    console.log(costData, "costData=======================");
    console.log(columnTotals, "columnTotals=======================");
    

    if (columnHoursData.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.classList.add("result-table");
////////////////////////

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>TEAM</th>` + columnHoursData.map(entry => `<th>${entry.column}</th>`).join("") + `<th>TOTAL</th>`;
    thead.appendChild(headerRow);
    table.appendChild(thead);

 
    let tbody = document.createElement("tbody");


    let hoursRow = document.createElement("tr");
    hoursRow.innerHTML = `<td><b>HOURS</b></td>` + Object.keys(columnTotals).map(header => `<td>${columnTotals[header]}</td>`).join("");

    let totalHours = Object.values(columnTotals).reduce((sum, value) => sum + value, 0);
    hoursRow.innerHTML += `<td>${totalHours}</td>`;
    tbody.appendChild(hoursRow);

    let percentageRow = document.createElement("tr");
    percentageRow.innerHTML = `<td><b>PERCENTAGE</b></td>` + columnHoursData.map(entry => `<td>${entry.hours}</td>`).join("") + `<td>100%</td>`;
    tbody.appendChild(percentageRow);

    let costRow = document.createElement("tr");
    costRow.innerHTML = `<td><b>COST</b></td>` + Object.keys(costData).map(header => `<td>$${costData[header]}</td>`).join("");

    let totalCost = Object.values(costData).reduce((sum, value) => sum + value, 0);
    costRow.innerHTML += `<td>$${totalCost}</td>`;

    let button_cant=document.createElement("div");
button_cant.classList.add("button_cant");
  
    let backButton=document.createElement("button");
    backButton.innerHTML=`<i class="fas fa-arrow-left"></i> Back`;
    backButton.classList.add("backButton");
    backButton.onclick = function () {  
      
        // window.location.href = "newTable.html";
        history.back();  
    };
    
    

    console.log(button_cant);
    button_cant.appendChild(backButton);


    tbody.appendChild(costRow);
    table.appendChild(tbody);
    container.appendChild(table);

container.appendChild(button_cant);
}




/////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("exportExcel").addEventListener("click", exportToExcel);

document.getElementById("printPDF").addEventListener("click", generatePDF);
function generatePDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF({ orientation: "landscape" });

    let tcData = JSON.parse(sessionStorage.getItem("tcData")) || [];
    console.log("Retrieved TC Data for PDF:", tcData);

    let columnHoursData = JSON.parse(sessionStorage.getItem("columnHoursData")) || [];
    let teamData = JSON.parse(sessionStorage.getItem("savedTableData")) || [];
    let columnTotals = JSON.parse(sessionStorage.getItem("columnTotals")) || {}; 
    let costData = JSON.parse(sessionStorage.getItem("costData")) || {};


    let teamHeaders = ["Task", "Description", ...columnHoursData.map(entry => entry.column), "PER TASK COST", "PER  TASK TOTAL HRS"];
    let teamRows = teamData.map((row, index) => {
        let rowValues = Object.values(row).map(value => value ? value : "N/A");
        let tcValue = tcData[index] !== undefined ? tcData[index] : "N/A"; 
        rowValues.splice(-1, 0, tcValue); 
        return rowValues;
    });

let tcTotal = tcData.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);  

let columnTotalRow = ["Column Total", "", ...Object.values(columnTotals), tcTotal, 
                      Object.values(columnTotals).reduce((sum, val) => sum + val, 0) ];


    teamRows.push(columnTotalRow);

    let calculationHeaders = ["TEAM", ...columnHoursData.map(entry => entry.column), "TOTAL"];
    let calculationRows = [];

    let hoursRow = ["HOURS", ...Object.values(columnTotals), 
                    Object.values(columnTotals).reduce((sum, val) => sum + val, 0)];

    let percentageRow = ["PERCENTAGE", ...columnHoursData.map(entry => entry.hours), "100%"];
    let costRow = ["COST", ...Object.values(costData).map(val => `$${val}`), 
                   `$${Object.values(costData).reduce((sum, val) => sum + val, 0)}`];

    calculationRows.push(hoursRow, percentageRow, costRow);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(50);
    doc.text("TEAM RESOURCES", 65, 15);
    
    doc.autoTable({
        head: [teamHeaders],
        body: teamRows,
        theme: "grid",
        styles: { halign: "center", valign: "middle" },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 10 },
        startY: 20
    });

    doc.autoTable({
        head: [calculationHeaders],
        body: calculationRows,
        theme: "grid",
        styles: { halign: "center", valign: "middle" },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 10 },
        startY: doc.lastAutoTable.finalY + 20
    });

    doc.save("RealEstate_Report.pdf");
}





























function exportToExcel() {
    let wb = XLSX.utils.book_new();

    let columnHoursData = JSON.parse(sessionStorage.getItem("columnHoursData")) || [];
    
    
    let teamData = JSON.parse(sessionStorage.getItem("savedTableData")) || [];
    let teamHeaders = ["Task", "Description", ...columnHoursData.map(entry => entry.column), "Total"];
    let teamRows = teamData.map(row => Object.values(row));
    teamRows.unshift(teamHeaders); 

   
    let costData = JSON.parse(sessionStorage.getItem("costData")) || {};
    let columnTotals = JSON.parse(sessionStorage.getItem("columnTotals")) || {};

    let calculationHeaders = ["TEAM", ...columnHoursData.map(entry => entry.column), "TOTAL"];
    let calculationRows = [];

    let hoursRow = ["HOURS", ...columnHoursData.map(entry => columnTotals[entry.column] || 0), Object.values(columnTotals).reduce((sum, val) => sum + val, 0)];
    let percentageRow = ["PERCENTAGE", ...columnHoursData.map(entry => entry.hours || 0), "100%"];
    let costRow = ["COST", ...columnHoursData.map(entry => costData[entry.column] || 0), Object.values(costData).reduce((sum, val) => sum + val, 0)];

    calculationRows.push(calculationHeaders);
    calculationRows.push(hoursRow);
    calculationRows.push(percentageRow);
    calculationRows.push(costRow);


    let finalData = [...teamRows, [" "], ...calculationRows]; 
    let sheet = XLSX.utils.aoa_to_sheet(finalData);

   
    let columnWidths = [
        { wch: 20 }, { wch: 40 },
        ...columnHoursData.map(() => ({ wch: 15 })), 
        { wch: 15 } 
    ];
    sheet['!cols'] = columnWidths;

   
    sheet['!rows'] = finalData.map((_, index) => ({ hpt: index === 0 ? 40 : 25 })); 

   
    let range = XLSX.utils.decode_range(sheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
        for (let R = range.s.r; R <= range.e.r; R++) {
            let cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (!sheet[cellRef]) continue;

          sheet[cellRef].s = {
    alignment: { horizontal: "center", vertical: "center", wrapText: true }, 
    font: { bold: R === 0, color: { rgb: "FFFFFF" } }, 
    fill: { fgColor: { rgb: "000000" } },
    border: { 
        top: { style: "thin", color: { rgb: "FFFFFF" } }, 
        bottom: { style: "thin", color: { rgb: "FFFFFF" } }, 
        left: { style: "thin", color: { rgb: "FFFFFF" } }, 
        right: { style: "thin", color: { rgb: "FFFFFF" } } 
    } 
};

        }
    }

  
    XLSX.utils.book_append_sheet(wb, sheet, "RealEstate_Report");
    XLSX.writeFile(wb, "RealEstate_Report.xlsx", { cellStyles: true });
}
