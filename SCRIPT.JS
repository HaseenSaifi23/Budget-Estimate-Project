window.onload = function () {


    let saveName=sessionStorage.getItem("projectName");
    if(saveName){
        document.getElementById('projectHeading').innerText = saveName;
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';  
        document.getElementById('staticTableContainer').style.display = 'block';
    
    }else{
        document.getElementById('popup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    
    
    }


   
    let savedTeamData = JSON.parse(sessionStorage.getItem("teamData")) ;

    if (savedTeamData.length > 0) {
        document.querySelector(".tbl tbody").innerHTML = ""; 

        savedTeamData.forEach(team => {
            let newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>
                    <input type="text" name="inp-tab" list="browsers" class="inp-tab"
                    value="${team.teamName}" readonly onfocus="this.removeAttribute('readonly')" onkeypress="return false;">
                </td>
                <td><input type="number" class="inp-tab team-count" value="${team.teamCount}"></td>
                <td class="cost-cell">${costMapping2[team.teamName] ? `$${costMapping2[team.teamName]}` : "0$"}</td>
                <td><button onclick="deleteRow(this)" id="Trash-button"><i class="fa-solid fa-trash"></i></button></td>
            `;
            document.querySelector(".tbl tbody").appendChild(newRow);
        });
    }




};


function saveProjectName() {
    let name = document.getElementById('projectName').value;

    if (name.trim() !== "") {
        sessionStorage.setItem("projectName", name); 

    
        document.getElementById('projectHeading').innerText = name;

    
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('staticTableContainer').style.display = 'block';

    } else {
        alert("Please enter a valid project name!");
    }
}

function addRow() {
    let table = document.querySelector(".tbl tbody");
    let newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>
            <input type="text" name="inp-tab" list="browsers" class="inp-tab" placeholder="Please Select Resources" title="Choose your Team" onchange="updateCost(this)" readonly onfocus="this.removeAttribute('readonly')"
       onkeypress="return false;" >
            <datalist id="browsers">
                <option value="PM">
                <option value="LEAD">
                <option value="QA"> 
                <option value="DEV">
                 <option value="BA">
            </datalist>
        </td>

        <td><input type="number" class="inp-tab team-count" placeholder="Please Enter Number of resources"></td>

        <td class="cost-cell">0$</td>

  <td>
  <button onclick="deleteRow(this)"  id="Trash-button"><i class="fa-solid fa-trash" ></i></button></td>
     
    `;

    table.appendChild(newRow);
}




let costMapping2 = { "PM": 25,  "QA": 15, "DEV": 10,  "LEAD": 20 , "BA": 5};

function updateCost(input) {
    let row = input.closest("tr");
    let costCell = row.querySelector(".cost-cell");
    let selectedRole = input.value.trim();
    if (costMapping2[selectedRole] !== undefined) {
        costCell.innerText = `$${costMapping2[selectedRole]}`;
  
    } else {
        costCell.innerText = "0$";
      
    }
}
function deleteRow(btn) {
    let row = btn.closest('tr');
    row.remove();
}


function getDynamicHeaders() {
    let headers = [];
    document.querySelectorAll(".dynamic-table thead th").forEach((th, index) => {
        if (index >= 2 && index < document.querySelectorAll(".dynamic-table thead th").length - 2) {
            headers.push(th.innerText);
        }
    });
    return headers;
}


function calculateColumnHours() {
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


    document.querySelectorAll(".dynamic-table thead th").forEach((th, index) => {
        if (index >= 2 && index < document.querySelectorAll(".dynamic-table thead th").length - 2) {
            let columnName = th.innerText.trim();
            let columnTotal = 0;
            // console.log(columnTotal,"============================");

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

    showRowHoursTable(columnHoursData);
    createHours();
}



function openNewTab() {
    let newTab = window.open("newTable.html", "_blank");  
}


function saveAndOpenNewTab() {
    let teamData = [];

    document.querySelectorAll(".tbl tbody tr").forEach(row => {
        let teamName = row.querySelector(".inp-tab")?.value?.trim();
        let teamCount = parseInt(row.querySelector(".team-count")?.value) || 0;

        if (teamName && teamCount > 0) {
            teamData.push({ teamName, teamCount });
        }
    });

    if (teamData.length === 0) {
        alert("Please fill the first table before creating a new one.");
        return;
    }

    sessionStorage.setItem("teamData", JSON.stringify(teamData));  
    window.open("newTable.html", "_self");  


}
    







//////////////////////////////////////////////EXTERA FUNCTION;-//////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    let spinner = document.getElementById('spinner');
    let content = document.getElementById('content');


    setTimeout(() => {
        spinner.style.display = 'none'; 
        content.classList.remove('hidden'); 
    }, 1000); 
});









