/**
 * this is responsible for:
 *  uploadiung a file and storing it temporary in uploads/appsFrom
 *  reading all data in the csv file and store it tmp in file Rows
 *  sending the data as 2D array in http response
 * 
 */

const fs = require('fs');
const multer = require('multer');
const express = require('express');
const Router = express.Router;
const XLSX = require('xlsx');

const router = new Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/appsFromExcel/');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${Date.now()}-${originalname}`);
    }
})

const upload = multer({ storage: storage });

router.put('/', function (req, res) {

    const sheet = req.body.sheetName;
    const filePath = req.body.filePath;

    const cols = {
        Name: Number(req.body.appName),
        Key: Number(req.body.appKey),
        Description: Number(req.body.appDescription),
        COTS: Number(req.body.appCOTS),
        Release: Number(req.body.appReleaseDate),
        Shutdown: Number(req.body.appShutdownDate)
    }

    const parsingOptions = {
        // sheets: sheet,
        cellFormula: false,
        cellHTML: false,
        cellDates: true,
        cellText: false,
    }

    const workbook = XLSX.readFile(filePath, parsingOptions);
    const worksheet = workbook.Sheets[sheet];
    const json = converSheetToJsonArray(worksheet, cols);
    const colNames = getColNames(worksheet, cols);
    data = mapColstoProp(json, colNames);

    fs.unlinkSync(filePath);

    res.send({
        status: 'ok',
        data: data
    });

})

router.post('/', upload.single('inpFile'), function (req, res) {

    const filePath = req.file.path;

    const data = {};

    // const colNames = {
    //     Name: req.body.appName,
    //     Key: req.body.appId,
    //     Description: req.body.appDescription,
    //     COTS: req.body.appCOTS,
    //     Release: req.body.appReleaseDate,
    //     Shutdown: req.body.appShutdownDate
    // }

    const parsingOptions = {
        cellFormula: false,
        cellHTML: false,
        cellDates: true,
        cellText: false,
    };

    const workbook = XLSX.readFile(filePath, parsingOptions);
    // let data = {};

    // const allSheetNames = workbook.SheetNames;

    // const realSheetName = findSheetName(sheetsName, Object.values(allSheetNames));

    // if (realSheetName) {
    //     const worksheet = workbook.Sheets[realSheetName];
    //     const { newColNames, colIndex } = getColIndex(colNames, worksheet);
    //     const json = converSheetToJsonArray(worksheet, colIndex);
    //     data = mapColstoProp(json, newColNames);
    // }

    //  delete the file

    data.filePath = filePath;
    data.sheets = getHeaders(filePath);

    res.send({
        status: 'ok',
        data: data
    });

});


const getHeaders = function (filePath) {

    const parsingOptions = {

        cellFormula: false,
        cellHTML: false,
        cellDates: true,
        cellText: false,
    };

    const wb = XLSX.readFile(filePath, parsingOptions);

    const allSheetNames = wb.SheetNames;

    // const sheets = [];

    const sheets = {};

    for (sheetName of allSheetNames) {

        const ws = wb.Sheets[sheetName]
        const { rows, cols } = getRowsAndCols(ws)

        sheets[sheetName] = {};

        for (let C = cols.start; C <= cols.end; C++) {
            const cellRef = encodeCell(0, C);

            let cellValue = '';

            if (ws[cellRef] && ws[cellRef].v) {
                cellValue = ws[cellRef].v;
            }
            sheets[sheetName][C] = cellValue;
        }
    }

    return sheets;
}

const getColNames = function (ws, cols) {
    const row = 0;
    const colNames = {};
    for ([propName, colNumber] of Object.entries(cols)) {
        colNames[propName] = ws[encodeCell(row, colNumber)].v;
    }
    return colNames;
}

const mapColstoProp = function (json, colNames) {

    const allApps = [];
    let newApp = {};

    for (const obj of json) {

        newApp = {};

        for (const [key, value] of Object.entries(colNames)) {
            newApp[key] = obj[value];
        }

        allApps.push(newApp);
    }

    return allApps;
}

const getColIndex = function (colNames, ws) {

    const firstRow = [];
    const { rows, cols } = getRowsAndCols(ws);
    const colIndex = {};
    const newColNames = {};

    for (let C = cols.start; C <= cols.end; C++) {
        let cellRef = encodeCell(0, C);
        if (ws[cellRef]) {
            firstRow.push(ws[cellRef].v);
        } else {
            firstRow.push('');
        }
    }

    for (const [key, value] of Object.entries(colNames)) {
        for (let index = 0; index < firstRow.length; index++) {
            if (firstRow[index].trim().toLowerCase() == value.trim().toLowerCase()) {
                colIndex[key] = index;
                newColNames[key] = firstRow[index];
                break;
            }
        }
    }

    return { newColNames, colIndex };
}

const findSheetName = function (name, allSheets) {

    for (const sheet of allSheets) {
        if (sheet.trim().toLowerCase() == name.trim().toLowerCase()) {
            return sheet;
        }
    }
    return false;
}

const converSheetToJsonArray = function (ws, colIndex) {
    // getting the range of the sheet
    const { rows, cols } = getRowsAndCols(ws);

    importantCols = {
        key: colIndex.Key,
        name: colIndex.Name
    }

    ws = detectFalseApplications(ws, rows.start, Object.values(importantCols));


    // converting to json
    const convertingOptions = {
        raw: false,
        range: ws['!ref'],
        blankrows: false
    }

    const json = XLSX.utils.sheet_to_json(ws, convertingOptions);

    return json;

}

const encodeCell = function (r, c) {
    return XLSX.utils.encode_cell({ r: r, c: c });
}

const getRowsAndCols = function (ws) {
    const sheetsRange = XLSX.utils.decode_range(ws['!ref']);
    const cols = { start: sheetsRange.s.c, end: sheetsRange.e.c };
    const rows = { start: sheetsRange.s.r, end: sheetsRange.e.r };

    return { rows, cols };
}

const deleteRow = function (ws, rowIndex) {

    let sheetsRangeDecoded = XLSX.utils.decode_range(ws["!ref"]);

    for (var R = rowIndex; R <= sheetsRangeDecoded.e.r; ++R) {
        for (var C = sheetsRangeDecoded.s.c; C <= sheetsRangeDecoded.e.c; ++C) {
            ws[encodeCell(R, C)] = ws[encodeCell(R + 1, C)];
        }
    }

    sheetsRangeDecoded.e.r--
    ws['!ref'] = XLSX.utils.encode_range(sheetsRangeDecoded.s, sheetsRangeDecoded.e);
    return ws;
}

const detectFalseApplications = function (ws, row = 0, importantCols) {

    let rowDeleted = false;
    const { rows, cols } = getRowsAndCols(ws);


    while (row <= rows.end) {
        for (let C = cols.start; C <= cols.end; ++C) {
            let cellRef = encodeCell(row, C);
            if (!ws[cellRef] || [null, undefined, ''].includes(ws[cellRef].v)) {
                if (importantCols.includes(C)) {
                    ws = deleteRow(ws, row);
                    rowDeleted = true;
                    break;
                } else {
                    ws[cellRef] = undefined
                }
            }
        }

        if (!rowDeleted) {
            row++;
        } else {
            rowDeleted = false;
            rows.end--;
        }

    }

    return ws;
}

module.exports = router;