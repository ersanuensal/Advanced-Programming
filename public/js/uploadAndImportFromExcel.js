const uploadForm = document.querySelector('#uploadForm');
const importForm = document.getElementById('importForm');

const cancelImportBtns = document.querySelectorAll('.cancelImportBtn');
const acceptResultsBtn = document.getElementById('acceptResults');
const showReslutsTableBtn = document.querySelector('#showReslutsTable');

const sheetName = document.getElementById('sheetName');

const resultsTable = document.querySelector('#resultsTable');

const endPoint = "/importAppsFromExcel";

const workbooks = new Object();
const memory = new Object();
const importedApps = new Array();
const ignoredApps = new Array();


sheetName.addEventListener('change', function (e) {
    const sheet = e.target.value;
    changeSelectOptions(sheet);
});

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
            saveImportedApps(json.data.applications);
            saveIgnoredApps(json.data.ignoredApplication);
            document.getElementById('showResultsModalBtn').click();
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

    while (importedApps.length > 0) {
        importedApps.pop();
    }

    listOfApps.forEach(app => {
        importedApps.push(app);
    })
}

const saveIgnoredApps = function (listOfApps) {

    while (ignoredApps.length > 0) {
        ignoredApps.pop();
    }

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

    const selectedOptions = new Object();

    for (let select of selects) {
        for (let option of select.options) {
            if (option.selected == true) {
                selectedOptions[select.name] = option.text;
            }
        }
    }

    memory[sheetName.value] = selectedOptions;

}

const initImputForm = function (data) {

    uploadForm.hidden = true;
    importForm.hidden = false;

    const workbook = data.workbook;
    const filePath = data.filePath;
    const fileName = document.getElementById('inpFile').files.item(0).name;

    document.getElementById('filePath').value = filePath;

    workbooks[fileName] = { ...workbook };

    if (sheetName.options) {
        while (sheetName.options.length > 0) {
            sheetName.options.remove(0);
        }
    }

    for (let sheet of Object.keys(workbook)) {
        const option = new Option(sheet, sheet);
        if (memory.hasOwnProperty(sheet)) {
            option.defaultSelected = true;
        }
        sheetName.appendChild(option);
    }

    sheetName.dispatchEvent(new Event('change'));
}

const changeSelectOptions = function (sheet) {

    const fileName = document.getElementById('inpFile').files.item(0).name;
    const selects = document.querySelectorAll('.selectOptions');

    const cols = { ...workbooks[fileName][sheet] };

    for (let select of selects) {

        if (select.disabled) {
            select.disabled = false;
        }

        if (select.options) {
            while (select.options.length > 0) {
                select.options.remove(0);
            }
        }

        for ([colNum, colName] of Object.entries(cols)) {
            const option = new Option(colName, colNum);
            if (memory.hasOwnProperty(sheet)) {
                if (memory[sheet][select.name] == colName.trim()) {
                    option.defaultSelected = true;
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

    return json;
}