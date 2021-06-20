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

router.post('/', upload.single('inpFile'), function (req, res) {

    const filePath = req.file.path;
    const firstRowIsHeader = Boolean(req.body.firstRowIsHeader)

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
    fs.unlinkSync(filePath);

    data.filePath = filePath;
    data.firstRowIsHeader = firstRowIsHeader;
    data.headers = getHeaders(workbook);

    res.send({
        status: 'ok',
        data: data
    });

});


const getHeaders = function (wb) {

    const allSheetNames = wb.SheetNames;

    const sheets = {};

    for (sheetName of allSheetNames) {
        sheets[sheetName] = [];
        const ws = wb.Sheets[sheetName]
        const { rows, cols } = getRowsAndCols(ws)

        for (let C = cols.start; C <= cols.end; C++) {
            cellRef = encodeCell(0, C);

            let cellValue = '';

            if (ws[cellRef] && ws[cellRef].v) {
                cellValue = ws[cellRef].v;
            }

            const obj = {}

            obj[C] = cellValue
            sheets[sheetName].push(obj);
        }
    }

    return sheets;
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

    /**
     * in this method we are going to go through the excel sheet cell by cell before converting it into array of Json objects,
     * the reason is that sheet_to_json method ignores all undefined cells.
     * undefined cells are not the empty cells, empty cell is defined, if a row has at least one not undefined cell (cell with the value '' for example)
     * the sheet_to_json() method is goin te convert the row containing this cell to a JSON object.
     * 
     * 
     * so my solution is to assign the value undefined to each cell whitch its value is '' (empty cell bur´t defined) 
     * if the all cells in a row are undefined the sheet_to_json method is going to ignore this row
     */

    // getting the range of the sheet
    const { rows, cols } = getRowsAndCols(ws);

    importantCols = {
        KeyIndex: colIndex.Key,
        nameIndex: colIndex.Name
    }

    /**
     * Delete each row which doesn't have Name or Key Column
     */

    ws = detectFalseApplications(ws, rows.start, Object.values(importantCols));


    // converting to json
    const convertingOptions = {
        raw: false,
        range: ws['!ref'],
        blankrows: false
    }

    /**
     * the sheet should be clean from empty cells now
     */

    const json = XLSX.utils.sheet_to_json(ws, convertingOptions);

    /**
     * the next step is to map the opjects propreties
     */

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