const uploadForm = document.querySelector('#uploadForm');
const importForm = document.getElementById('importForm');
const cancelImportBtns = document.querySelectorAll('.cancelImportBtn');
const acceptResultsBtn = document.getElementById('acceptResults');
const showReslutsTableBtn = document.querySelector('#showReslutsTable');
const resultsTable = document.querySelector('#resultsTable');


const endPoint = "/importAppsFromExcel";

const memory = new Object();
const importedApps = new Array();
const ignoredApps = new Array();

for (const btn of cancelImportBtns) {
    btn.addEventListener('click', async function (e) {
        const filePath = document.querySelector('#filePath').value;
        importForm.hidden = true;
        uploadForm.hidden = false;
        deleteFileFromServer(filePath);
    });
}


uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    uploadToServer();
});

importForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    getAppsFromExcel(e);
});


acceptResultsBtn.addEventListener('click', function () {
    appendNewApps();
});

showReslutsTableBtn.addEventListener('click', function () {
    while (resultsTable.hasChildNodes()) {
        resultsTable.firstChild.remove();
    }
    fillTheResultTable();
})

const checkResponse = function (response) {
    if (response.ok) {
        return response;
    }
    throw Error(response.statusText);
}

const deleteFileFromServer = async function (filePath) {

    const formData = new FormData()
    formData.set('filePath', filePath)
    const options = {
        method: "delete",
        headers: {
            'Content-Type': 'application/json'
        },
        body: convertToJson(formData)
    }

    await fetch(endPoint, options)
        .then(checkResponse)
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
        .catch(err => console.log(err))
}

const uploadToServer = async function () {

    const inpFile = document.getElementById('inpFile');

    const formData = new FormData()

    formData.set("inpFile", inpFile.files[0]);

    await fetch(endPoint, {
        method: "post",
        body: formData

    })
        .then(checkResponse)
        .then(res => res.json())
        .then(json => { initImputForm(json.data); })
        .catch(err => console.log(err));
}

const getAppsFromExcel = async function (ev) {

    const formData = new FormData(ev.target);

    saveSelectNames();

    console.log(memory);

    const options = {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },
        body: convertToJson(formData)
    }

    await fetch(endPoint, options)
        .then(checkResponse)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            document.getElementById('showResultsModalBtn').click();
            saveImportedApps(json.data.applications);
            saveIgnoredApps(json.data.ignoredApplication);
        })
        .catch(err => console.log(err));

    importForm.hidden = true;
    uploadForm.hidden = false;
}

const fillTheResultTable = function () {
    const tableHeader = new Array();
    tableHeader.push('#');


    if (ignoredApps.length > 0) {
        for (key of Object.keys(ignoredApps[0])) {
            tableHeader.push(key);
        }
    }

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    for (let head of tableHeader) {
        const th = document.createElement('th');
        th.innerHTML = head;
        th.scope = 'col';
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    resultsTable.appendChild(thead);

    const tbody = document.createElement('tbody');

    for ([index, app] of ignoredApps.entries()) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.innerHTML = index + 1;
        tr.appendChild(th);
        for (let head of tableHeader) {
            if (head != '#') {
                const td = document.createElement('td');
                if (app.hasOwnProperty(head)) {
                    td.innerHTML = app[head];
                } else {
                    td.innerHTML = '';
                }
                tr.appendChild(td)
            }
        }
        tbody.appendChild(tr);
    }
    resultsTable.appendChild(tbody);
}

const saveImportedApps = function (listOfApps) {
    listOfApps.forEach(app => {
        importedApps.push(app);
    })
}

const saveIgnoredApps = function (listOfApps) {
    for (const [index, app] of listOfApps.entries()) {
        if (index >= 99) {
            break;
        } else {
            ignoredApps.push(app.app);
        }
    }
}

const saveSelectNames = function () {
    const selects = document.querySelectorAll('.selectOptions');

    for (let select of selects) {
        if (select.options.length > 0) {
            for (option of select.options) {
                if (option.selected == true) {
                    if (memory.hasOwnProperty(select.name)) {
                        memory[select.name].add(option.text);
                    } else {
                        memory[select.name] = new Set().add(option.text);
                    }
                }
            }
        }
    }
}

const initImputForm = function (data) {

    uploadForm.hidden = true;
    importForm.hidden = false;

    const sheets = data.sheets;
    const file_path = data.filePath;

    const sheetName = document.getElementById('sheetName');
    document.getElementById('filePath').value = file_path;

    if (sheetName.options) {
        while (sheetName.options.length > 0) {
            sheetName.options.remove(0);
        }
    }

    for (sheet of Object.keys(sheets)) {
        sheetName.appendChild(new Option(sheet, sheet));
    }

    sheetName.addEventListener('change', function (e) {
        const sheet = e.target.value;
        changeSelectOptions(sheets[sheet]);
    });

    sheetName.dispatchEvent(new Event('change'));

}

const changeSelectOptions = function (cols) {

    const selects = document.querySelectorAll('.selectOptions');

    for (let select of selects) {
        select.disabled = false;
        if (select.options) {
            while (select.options.length > 0) {
                select.options.remove(0);
            }
        }
        for ([colNum, colName] of Object.entries(cols)) {
            const option = new Option(colName, colNum);
            if (memory.hasOwnProperty(select.name)) {
                if (memory[select.name].has(colName)) {
                    option.selected = true;
                }
            }
            select.appendChild(option);
        }
    }
}

const appendNewApps = function () {
    myDiagram.model.addNodeDataCollection(importedApps);
}

const convertToJson = function (fd) {
    const object = {};
    fd.forEach((value, key) => object[key] = value);
    const json = JSON.stringify(object);

    console.log(json);
    return json;
}