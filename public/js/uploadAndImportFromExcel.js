class Sheet {
	constructor(
		name,
		appKey,
		appName,
		appDescription,
		appCOTS,
		appReleaseDate,
		appShutdownDate
	) {
		(this.name = name),
			(this.appKey = appKey),
			(this.appName = appName),
			(this.appCOTS = appCOTS),
			(this.appDescription = appDescription),
			(this.appReleaseDate = appReleaseDate),
			(this.appShutdownDate = appShutdownDate);
	}
}

const uploadForm = document.querySelector("#uploadForm");
const importForm = document.getElementById("importForm");

const cancelImportBtns = document.querySelectorAll(".cancelImportBtn");
const acceptResultsBtn = document.getElementById("acceptResults");
const showReslutsTableBtn = document.querySelector("#showReslutsTable");
const showResultsModalBtn = document.getElementById("showResultsModalBtn");

const sheetName = document.getElementById("sheetName");

const resultsTable = document.querySelector("#resultsTable");

const endPoint = "/importAppsFromExcel";

const workbooks = new Object();
const memory = new Object();

const importedApps = new Array();
const ignoredApps = new Array();

const memoryInit = function () {
	const options = {};
	fetch("/getMemoryFromDb", options)
		.then((res) => res.json())
		.then((json) => {
			json.data.listOfSheets.forEach((sheet) => {
				memory[sheet.name] = {
					appName: sheet.appName,
					appKey: sheet.appKey,
					appDescription: sheet.appDescription,
					appCOTS: sheet.appCOTS,
					appReleaseDate: sheet.appReleaseDate,
					appShutdownDate: sheet.appShutdownDate,
				};
			});
		})
		.catch((err) => console.log(err));
};

memoryInit();

sheetName.addEventListener("change", function (e) {
	const sheet = e.target.value;
	changeSelectOptions(sheet);
});

for (const btn of cancelImportBtns) {
	btn.addEventListener("click", async function (e) {
		const filePath = document.querySelector("#filePath").value;
		importForm.hidden = true;
		uploadForm.hidden = false;
		deleteFileFromServer(filePath);
	});
}

uploadForm.addEventListener("submit", async function (e) {
	e.preventDefault();
	uploadToServer();
});

importForm.addEventListener("submit", async function (e) {
	e.preventDefault();
	getAppsFromExcel(e);
});

acceptResultsBtn.addEventListener("click", function () {
	appendNewApps();
});

showReslutsTableBtn.addEventListener("click", function () {
	while (resultsTable.hasChildNodes()) {
		resultsTable.firstChild.remove();
	}
	fillTheResultTable();
});

const checkResponse = function (response) {
	if (response.ok) {
		return response;
	}
	throw Error(response.statusText);
};

const deleteFileFromServer = async function (filePath) {
	const formData = new FormData();
	formData.set("filePath", filePath);
	const options = {
		method: "delete",
		headers: {
			"Content-Type": "application/json",
		},
		body: convertToJson(formData),
	};

	await fetch(endPoint, options)
		.then(checkResponse)
		.then((res) => res.json())
		.then((json) => {
			console.log(json);
		})
		.catch((err) => console.log(err));
};

const uploadToServer = async function () {
	const inpFile = document.getElementById("inpFile");

	const formData = new FormData();

	formData.set("inpFile", inpFile.files[0]);

	await fetch(endPoint, {
		method: "post",
		body: formData,
	})
		.then(checkResponse)
		.then((res) => res.json())
		.then((json) => {
			initImputForm(json.data);
		})
		.catch((err) => console.log(err));
};

const getAppsFromExcel = async function (ev) {
	const formData = new FormData(ev.target);

	saveSelectNames();

	const options = {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: convertToJson(formData),
	};

	await fetch(endPoint, options)
		.then(checkResponse)
		.then((res) => res.json())
		.then((json) => {
			console.log(json.data.applications);
			console.log(json.data.ignoredApplications);
			saveImportedApps(json.data.applications);
			saveIgnoredApps(json.data.ignoredApplications);
			fillMsgBox();
			importForm.hidden = true;
			uploadForm.hidden = false;
		})
		.catch((err) => console.log(err));
};

const fillMsgBox = function () {
	const msgBox = document.getElementById("importMsg");
	while (msgBox.hasChildNodes()) {
		msgBox.firstChild.remove();
	}
	const p = document.createElement("h5");
	p.className = "fs-5";
	p.innerHTML = `${importedApps.length} app has been successfully imported and ${ignoredApps.length} app are ignored.`;
	msgBox.appendChild(p);
	document.getElementById("showResultsModalBtn").click();
};

const fillTheResultTable = function () {
	const tableHeader = new Array();
	tableHeader.push("#");

	if (ignoredApps.length > 0) {
		for (key of Object.keys(ignoredApps[0])) {
			tableHeader.push(key);
		}
	}

	const thead = document.createElement("thead");
	const tr = document.createElement("tr");

	for (let head of tableHeader) {
		const th = document.createElement("th");
		th.innerHTML = head;
		th.scope = "col";
		tr.appendChild(th);
	}
	thead.appendChild(tr);
	resultsTable.appendChild(thead);

	const tbody = document.createElement("tbody");

	for ([index, app] of ignoredApps.entries()) {
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		th.scope = "row";
		th.innerHTML = index + 1;
		tr.appendChild(th);
		for (let head of tableHeader) {
			if (head != "#") {
				const td = document.createElement("td");
				if (app.hasOwnProperty(head)) {
					td.innerHTML = app[head];
				} else {
					td.innerHTML = "";
				}
				tr.appendChild(td);
			}
		}
		tbody.appendChild(tr);
	}
	resultsTable.appendChild(tbody);
};

const saveImportedApps = function (listOfApps) {
	while (importedApps.length > 0) {
		importedApps.pop();
	}

	listOfApps.forEach((app) => {
		const tmpApp = {
			Name: "",
			Version: "",
			Description: "",
			COTS: "",
			Release: "",
			Shutdown: "",
			color: "blue",
			figure: "Subroutine",
			dateToday: new Date().toISOString().split("T")[0],
		};

		for (const [key, value] of Object.entries(app)) {
			tmpApp[key] = value;
		}

		if (app.Release && app.Release != "") {
			tmpApp.Release = new Date(app.Release).toISOString().split("T")[0];
		}

		if (app.Shutdown && app.Shutdown != "") {
			tmpApp.Shutdown = new Date(app.Shutdown).toISOString().split("T")[0];
		}

		importedApps.push(tmpApp);
	});
};

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
};

const saveSelectNames = function () {
	const selects = document.querySelectorAll(".selectOptions");

	const selectedOptions = new Object();

	let persists = false;

	for (let select of selects) {
		for (let option of select.options) {
			if (option.selected == true) {
				selectedOptions[select.name] = option.text;
			}
		}
	}

	if (memory.hasOwnProperty(sheetName.value)) {
		console.log("this sheet exists in memory");
		const tmp = memory[sheetName.value];
		if (JSON.stringify(tmp) == JSON.stringify(selectedOptions)) {
			console.log("memory is up to date");
		} else {
			console.log("memory is not up to date");
			persists = true;
			// save new memory in the database
		}
	} else {
		persists = true;
		// save new memory in the database
	}

	memory[sheetName.value] = selectedOptions;

	if (persists) {
		saveMemory(sheetName.value);
	}
};

const saveMemory = function () {
	const tmpList = new Array();

	for (const [sheetName, tmp] of Object.entries(memory)) {
		tmpList.push(
			new Sheet(
				sheetName,
				tmp.appKey,
				tmp.appName,
				tmp.appDescription,
				tmp.appCOTS,
				tmp.appReleaseDate,
				tmp.appShutdownDate
			)
		);
	}

	console.log("Liste: ", tmpList);

	saveMemoryInDb(tmpList);
};

const saveMemoryInDb = async function (listOfSheets) {
	// document.getElementById('listOfSheets').value = JSON.stringify(listOfSheets);
	// document.getElementById('saveMemoryInDb').submit();

	const data = { listOfSheets: listOfSheets };

	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	await fetch("/saveMemoryInDb", options)
		.then(checkResponse)
		.then((res) => res.json())
		.then((json) => {
			console.log(json);
		})
		.catch((err) => console.log(err));
};

const initImputForm = function (data) {
	uploadForm.hidden = true;
	importForm.hidden = false;

	const workbook = data.workbook;
	const filePath = data.filePath;
	const fileName = document.getElementById("inpFile").files.item(0).name;

	document.getElementById("filePath").value = filePath;

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

	sheetName.dispatchEvent(new Event("change"));
};

const changeSelectOptions = function (sheet) {
	const fileName = document.getElementById("inpFile").files.item(0).name;
	const selects = document.querySelectorAll(".selectOptions");

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
};

const appendNewApps = function () {
	myDiagram.model.addNodeDataCollection(importedApps);
	myDiagram.commit(function (d) {
		d.links.each(function (link) {
			var renaming = "updating ...";
			myDiagram.model.setDataProperty(link.data, "Name", renaming);
		});
	});
};

const convertToJson = function (fd) {
	const object = {};
	fd.forEach((value, key) => (object[key] = value));

	const json = JSON.stringify(object);

	return json;
};
