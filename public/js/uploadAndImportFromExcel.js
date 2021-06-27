
const uploadForm = document.querySelector('#uploadForm');
const importForm = document.getElementById('importForm');
const cancelImportBtns = document.querySelectorAll('.cancelImportBtn');
const endPoint = "/importAppsFromExcel";

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
            document.getElementById('showResultsModalBtn').click()
        })
        .catch(err => console.log(err));

    importForm.hidden = true;
    uploadForm.hidden = false;
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
            select.appendChild(new Option(colName, colNum));
        }
    }
}

const appendNewApps = function (apps) {
    myDiagram.model.addNodeDataCollection(apps)
}

const convertToJson = function (fd) {
    const object = {};
    fd.forEach((value, key) => object[key] = value);
    const json = JSON.stringify(object);

    console.log(json);
    return json;
}