
window.onload = function () {
    let teamData = JSON.parse(sessionStorage.getItem("teamData")) || [];
    let container = document.getElementById("dynamicTableContainer");
    let savedTableData = JSON.parse(sessionStorage.getItem("savedTableData")) || [];
  

 
    

    if (teamData.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    
    let table = document.createElement("table");
    table.setAttribute("border", "1");
    table.classList.add("dynamic-table");

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Task</th><th>Description</th>`;


    let dynamicHeaders = [];
    teamData.forEach(team => {
        for (let i = 1; i <= team.teamCount; i++) {
            let colName = `${team.teamName} ${i}`;
            dynamicHeaders.push(colName);
            headerRow.innerHTML += `<th>${colName}</th>`;
        }
    });

    headerRow.innerHTML += `<th>Total</th>`;
        // headerRow.innerHTML += `<th>TC</th>`;

    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);


    function addNewRow(data = []) {
        let newRow = document.createElement("tr");
        

        newRow.innerHTML =`<td><textarea placeholder="Please Enter Task" id="small-textare" oninput="saveTableData()">${data[0] || ''}</textarea></td>
<td><textarea placeholder="Enter Description" id="long-textare" oninput="saveTableData()">${data[1] || ''}</textarea></td>`

        dynamicHeaders.forEach((header, index) => {
            newRow.innerHTML += `<td><input type="number" class="${header.replace(/\s+/g, '')}" 
            placeholder="Hours" value="${data[index + 2] || ''}" oninput="calculateRowTotal(this); saveTableData();"></td>`;
        });

        newRow.innerHTML += `<td><input type="number" class="total" disabled placeholder="Total"></td>`;

        // newRow.innerHTML += `<td><input type="number" class="tc-column" disabled placeholder="TC"></td>`;

        tbody.appendChild(newRow);
        attachTextarea();
    }




    if (savedTableData.length > 0) {
        savedTableData.forEach(rowData => addNewRow(rowData));
        setTimeout(() => {
            attachTextarea();  
        }, 100);
    } else {
        addNewRow();
        attachTextarea();
    }

    


    // addNewRow(); 
    table.appendChild(tbody);

    let tfoot = document.createElement("tfoot");
    let footerRow = document.createElement("tr");
    let footerFixed = document.createElement("td");
    footerFixed.colSpan = 2;
    footerFixed.innerHTML = "<b>Column Total</b>";
    footerRow.appendChild(footerFixed);

    dynamicHeaders.forEach(headerText => {
        let td = document.createElement("td");
        td.id = headerText.replace(/\s+/g, '') + "Total";
        td.innerText = "0";
        footerRow.appendChild(td);
    });

    let grandTotalTd = document.createElement("td");
    grandTotalTd.id = "grandTotal";
    grandTotalTd.innerText = "0";
    footerRow.appendChild(grandTotalTd);


    // Add a new cell for TC total
// let tcTotalTd = document.createElement("td");
// tcTotalTd.id = "tcTotal";
// tcTotalTd.innerText = "0";
// footerRow.appendChild(tcTotalTd);


    let emptyTd = document.createElement("td");
    footerRow.appendChild(emptyTd);
    tfoot.appendChild(footerRow);
    table.appendChild(tfoot);

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    let addRowBtn = document.createElement("button");
    addRowBtn.classList.add("add-row-btn");
    addRowBtn.innerHTML = `<i class="fa-solid fa-plus" ></i>`;
    addRowBtn.onclick = function () {
        addNewRow();
        saveTableData();
    };


    let deleteRowBtn = document.createElement("button");
    deleteRowBtn.classList.add("Newtabel_tarsh");
    deleteRowBtn.innerHTML = `<i class="fa-solid fa-trash" ></i>`;

    deleteRowBtn.onclick = function () {
        let rows = tbody.getElementsByTagName("tr");
        if (rows.length > 1) {
            tbody.removeChild(rows[rows.length - 1]);
            updateColumnTotals();
            saveTableData()
        } else {
            alert("At least one row is required!");
        }
    };

    let calculateBtn = document.createElement("button");
    calculateBtn.innerHTML = 'NEXT <i class="fas fa-arrow-right"></i> ';
    calculateBtn.id = "calculateHoursBtn";
    calculateBtn.onclick = function () {
        calculateColumnHours();
    };


    let backbutton = document.createElement("button")
    backbutton.classList.add("back-button");
    backbutton.innerHTML = `<i class="fas fa-arrow-left"></i> BACK`;
    backbutton.onclick = function () {
        window.location.href = "INDEX.HTML";
    }




    buttonContainer.appendChild(addRowBtn);
    buttonContainer.appendChild(deleteRowBtn);
    buttonContainer.appendChild(calculateBtn);
    buttonContainer.appendChild(backbutton);
    container.appendChild(table);
    container.appendChild(buttonContainer);



    setTimeout(() => {
        document.querySelectorAll(".dynamic-table tbody tr").forEach(row => {
            calculateRowTotal(row.querySelector("input"));
        });
        updateColumnTotals();
    }, 100);

    console.log("Loading savedTableData:", sessionStorage.getItem("savedTableData"));
    console.log("Loading columnTotals:", sessionStorage.getItem("columnTotals"));

};

function adjustTextareaHeight(textarea) {
    textarea.style.height = "auto"; 
    textarea.style.height = textarea.scrollHeight + "px"; 
}

function attachTextarea() {
    document.querySelectorAll("textarea").forEach(textarea => {
        textarea.removeEventListener("input", adjustTextareaHeight);
        textarea.addEventListener("input", function () {
            adjustTextareaHeight(this);
        });
        adjustTextareaHeight(textarea); 
    });
}

document.addEventListener("input", function (event) {
    if (event.target.tagName === "INPUT") {
        // saveTableData(); 
    }
});

attachTextarea()


function saveTableData() {
    let tableData = [];
    document.querySelectorAll(".dynamic-table tbody tr").forEach(row => {
        let rowData = [];
        row.querySelectorAll("td textarea, td input").forEach(input => {
            rowData.push(input.value);
        });
        tableData.push(rowData);
    });


    sessionStorage.setItem("savedTableData", JSON.stringify(tableData));
    console.log("Data Saved:", tableData);
}

window.calculateRowTotal = function (inputElement) {
    let row = inputElement.closest("tr");
    let total = 0;
    let PerTeamCost = 0;

    let costMapping = { "PM": 25, "LEAD": 20, "QA": 15, "DEV": 10, "BA": 5 };

    row.querySelectorAll("td input[type='number']").forEach(input => {
        let columnClass = input.classList[0]; 
        let role = columnClass.match(/^[A-Za-z]+/); 

        if (!input.classList.contains("total") && !input.classList.contains("tc-column")) {
            let value = parseInt(input.value) || 0;
            total += value;

            if (role && costMapping[role[0]]) {
                PerTeamCost += value * costMapping[role[0]];
            }
        }
    });

    row.querySelector(".total").value = total;

    console.log(`Row ${row.rowIndex - 1} ka PerTeamCost:`, PerTeamCost);

 
    
    let storedTCData = JSON.parse(sessionStorage.getItem("tcData")) || [];
    storedTCData[row.rowIndex - 1] = PerTeamCost; 
    sessionStorage.setItem("tcData", JSON.stringify(storedTCData));

    console.log("Updated TC Data:", storedTCData);

    updateColumnTotals();
};


window.updateColumnTotals = function () {
    let headers = document.querySelectorAll(".dynamic-table thead th");
    let grandTotal = 0;
    let tcTotal = 0; 

    
    headers.forEach((th, index) => {
        if (index >= 2 && index < headers.length - 1) {
            let columnClass = th.innerText.replace(/\s+/g, '');
            let columnTotal = 0;
            document.querySelectorAll(`.${columnClass}`).forEach(input => {
                columnTotal += parseInt(input.value) || 0;

            });

            document.getElementById(columnClass + "Total").innerText = columnTotal;
            grandTotal += columnTotal;
        }
    });
    document.querySelectorAll(".tc-column").forEach(input => {
        tcTotal += parseInt(input.value) || 0;
    });

      
       document.getElementById("grandTotal").innerText = grandTotal;
   
};


window.deleteRow = function (btn) {
    btn.closest("tr").remove();
    updateColumnTotals();
};


window.calculateColumnHours = function () {
    let grandTotalElement = document.getElementById("grandTotal");

    if (!grandTotalElement) {
        alert("Grand Total element not found!");
        return;
    }

    let grandTotal = parseFloat(grandTotalElement.innerText) || 0;

    if (grandTotal <= 0) {
        alert("Grand Total is zero, cannot calculate column hours.");
        return;
    }

    let columnHoursData = [];
    let columnTotals = {};

    let headers = document.querySelectorAll(".dynamic-table thead th");

    headers.forEach((th, index) => {
        if (index >= 2 && index < headers.length - 1) {
            let columnName = th.innerText.trim();
            let columnTotal = 0;

            document.querySelectorAll(".dynamic-table tbody tr").forEach(row => {
                let cellValue = parseFloat(row.cells[index]?.querySelector("input")?.value) || 0;
                columnTotal += cellValue;
            });

            columnTotals[columnName] = columnTotal;


        }
    });

    Object.keys(columnTotals).forEach(column => {
        let hours = (columnTotals[column] * 100) / grandTotal;
        columnHoursData.push({ column: column, hours: hours.toFixed(2) + "%" });
    });


    let costMapping = { "PM": 25, "LEAD": 20, "QA": 15, "DEV": 10 ,"BA": 5};
    let costData = {};

    Object.keys(columnTotals).forEach(header => {
        let role = header.split(" ")[0];
        costData[header] = (costMapping[role] || 0) * columnTotals[header];
    });



    console.log("columnHoursData:", columnHoursData);
    console.log("costData:", costData);
    console.log("columnTotals:", columnTotals);



    sessionStorage.setItem("columnHoursData", JSON.stringify(columnHoursData));
    sessionStorage.setItem("costData", JSON.stringify(costData));
    sessionStorage.setItem("columnTotals", JSON.stringify(columnTotals));



    
    window.open("calculation.html", "_self");
};



