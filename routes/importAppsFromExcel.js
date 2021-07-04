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

    let filePath = '';
    let status = 'ok';
    const data = new Object();

    try {
        if (fs.existsSync(req.file.path)) {
            filePath = req.file.path;
        } else {
            throw new Error("File (path) not found");
        }
        data.filePath = filePath;
        data.workbook = getSheetsWithHeaders(filePath);
    } catch (error) {
        status = "500";
        data.message = "Some internal error has occured";
        data.error = error.message;
    } finally {
        res.send({
            status: status,
            data: data
        });
    }
});

const getSheetsWithHeaders = function (filePath) {

    const parsingOptions = {
        cellFormula: false,
        cellHTML: false,
        cellDates: true,
        cellText: false,
    };

    const wb = XLSX.readFile(filePath, parsingOptions);

    const allSheetNames = wb.SheetNames;

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

router.delete('/', function (req, res) {

    const data = new Object();
    let status = 'ok';

    try {
        if (fs.existsSync(req.body.filePath)) {
            fs.unlinkSync(req.body.filePath);
            data.nessage = 'File is deleted successfully';
        } else {
            throw new Error('File not found')
        }
    } catch (error) {
        status = '404';
        data.message = error.message;
    } finally {
        res.send({
            status: status,
            data: data
        })
    }

});

router.put('/', function (req, res) {
    const sheet = req.body.sheetName;
    let filePath = "";
    const data = new Object();
    let status = 'ok';

    try {
        if (fs.existsSync(req.body.filePath)) {
            filePath = req.body.filePath
        } else {
            throw new Error("File (path) not found");
        }
        const cols = {
            Name: Number(req.body.appName),
            Key: Number(req.body.appKey),
            Description: Number(req.body.appDescription),
            COTS: Number(req.body.appCOTS),
            Release: Number(req.body.appReleaseDate),
            Shutdown: Number(req.body.appShutdownDate)
        }

        const parsingOptions = {
            cellFormula: false,
            cellHTML: false,
            cellDates: true,
            cellText: false,
        }

        const workbook = XLSX.readFile(filePath, parsingOptions);
        const worksheet = workbook.Sheets[sheet];
        const { json, deletedRows } = converSheetToJsonArray(worksheet, cols);
        const colNames = getColNames(worksheet, cols);
        const applications = mapColsToProp(json, colNames);

        const ignoredApplication = new Array()

        deletedRows.forEach(deletedRow => {
            ignoredApplication.push({
                'reason': colNames[deletedRow.reason],
                'app': mapColsToProp([deletedRow.row], colNames)[0]
            });
        })

        data['ignoredApplication'] = ignoredApplication;
        data['applications'] = applications;

        fs.unlinkSync(filePath);

    }
    catch (error) {
        status = '404';
        data.fileDeleted = fs.existsSync(filePath);
        data.message = 'NO APP WAS IMPORTED. SOME INTERNAL ERROR HAPPENED.';
        data.error = error.message;
    }
    finally {
        res.send({
            status: status,
            data: data
        });
    }
})

const converSheetToJsonArray = function (ws, colIndex) {

    importantCols = {
        key: colIndex.Key,
        name: colIndex.Name
    }

    const { ws: newWs, deletedRows } = detectFalseApplications(ws, Object.values(importantCols));

    // converting to json
    const convertingOptions = {
        raw: false,
        range: newWs['!ref'],
        blankrows: false
    }

    const json = XLSX.utils.sheet_to_json(newWs, convertingOptions);

    return { json, deletedRows };

}

const getRowsAndCols = function (ws) {
    const sheetsRange = XLSX.utils.decode_range(ws['!ref']);

    const cols = { start: sheetsRange.s.c, end: sheetsRange.e.c };
    const rows = { start: sheetsRange.s.r, end: sheetsRange.e.r };

    return { rows, cols };
}

const detectFalseApplications = function (ws, importantCols) {

    let deleted = false;
    const { rows, cols } = getRowsAndCols(ws);
    let row = 0;
    const deletedRows = new Array()

    /**
     * travling through the sheet cell by cell
     * if a empty cell if found, see if this cell is in an important column
     * if yes then just delete the whole row
     * if no just assign undefined to it
     */
    while (row <= rows.end) {
        /**
         * ceck all columns in this row 
         */
        for (let C = cols.start; C <= cols.end; ++C) {

            let cellRef = encodeCell(row, C);

            if (!ws[cellRef] || [null, undefined, ''].includes(ws[cellRef].v)) {
                if (importantCols.includes(C)) {
                    /**
                     * remove this row from th sheet and return the deleted row and the new sheet
                     */
                    const { ws: newWs, deletedRow } = deleteRow(ws, row);
                    ws = newWs
                    /**
                    * push the deletd row to the list of the deleted rows with the reson for deletion (wich proprety it doesn't have)
                    */
                    deletedRows.push({
                        reason: ws[encodeCell(0, C)].v,
                        row: deletedRow
                    })
                    deleted = true;
                    break;
                    // leave the for loop
                } else {
                    ws[cellRef] = undefined
                }
            }
        }

        // deleting a row works this way: table[x] = table[x+1]
        // if the row is deleted, than next checking round should start from present row, because the present row is 
        // now the previos next row
        if (!deleted) {
            // if the no row is deletd than just pass to the next row
            row++;
        } else {
            // if a row is deleted, than the number of rows in sheet/table should be decremented
            deleted = false;
            // the loop should go until number of row - 1, because a row is deleted
            rows.end--;
        }

    }

    return { ws, deletedRows };
}

const deleteRow = function (ws, rowIndex) {

    const range = XLSX.utils.decode_range(ws['!ref']);

    const deletedRow = new Object();

    for (let C = range.s.c; C <= range.e.c; ++C) {
        if (ws[encodeCell(0, C)] && ws[encodeCell(0, C)].v) {
            let colName = ws[encodeCell(0, C)].v;
            let cellRef = encodeCell(rowIndex, C);
            if (!ws[cellRef] || [undefined, null, ''].includes(ws[cellRef].v)) {
                deletedRow[colName] = '';
            } else {
                deletedRow[colName] = ws[cellRef].v;
            }
        }
    }

    for (var C = range.s.c; C <= range.e.c; ++C) {
        for (var R = rowIndex; R <= range.e.r; ++R) {
            ws[encodeCell(R, C)] = ws[encodeCell(R + 1, C)];
        }
    }

    if (range.e.r > 0) {
        range.e.r--;
    }

    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e);

    return { ws, deletedRow };
}

const getColNames = function (ws, cols) {
    const row = 0;
    const colNames = {};
    for ([propName, colNumber] of Object.entries(cols)) {
        let cellRef = encodeCell(row, colNumber);
        let value = ''
        if (ws[cellRef] && [undefined, null, ''].includes(ws[cellRef].v) == false) {
            value = ws[cellRef].v;
        }
        colNames[value] = propName;
    }
    return colNames;
}

const mapColsToProp = function (listOfObjects, colNames) {

    const allApps = [];

    for (const obj of listOfObjects) {

        let newApp = new Object();

        for (const [key, value] of Object.entries(colNames)) {
            newApp[value] = obj[key];
        }

        allApps.push(newApp);
    }

    return allApps;
}

const encodeCell = function (r, c) {
    return XLSX.utils.encode_cell({ r: r, c: c });
}


module.exports = router;