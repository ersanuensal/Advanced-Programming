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
    const parsingOptions = {
        type: 'string',
        cellFormula: false,
        cellHTML: false,
        cellDates: true,
        cellText: false,
    };

    const workbook = XLSX.readFile(filePath, parsingOptions);
    const worksheet = workbook.Sheets['Applications'];

    const data = converSheetToJsonArray(worksheet);
    // const data = json;


    //  delete the file
    fs.unlinkSync(filePath);

    //const data = XLSX.utils.sheet_to_json(worksheet);

    res.send({
        status: 'ok',
        data: data
    });

});


const converSheetToJsonArray = function (ws) {

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
    const sheetrange_encoded = ws['!ref'];
    // the range is encoded in format like A1:H21
    const sheetrange_decoded = XLSX.utils.decode_range(sheetrange_encoded);

    // get row and col range
    cols = { start: sheetrange_decoded.s.c, end: sheetrange_decoded.e.c }
    rows = { start: sheetrange_decoded.s.r, end: sheetrange_decoded.e.r }

    // going through the cells one by one 
    for (let R = rows.start; R < rows.end; R++) {
        for (let C = cols.start; C < cols.end; C++) {
            let cellRef = XLSX.utils.encode_cell({ c: C, r: R });
            if (ws[cellRef]) { /**if the cell is defined/exists */
                /**
                 * check if cell is empty
                 * if yes: assign undefined to this cell
                 */
                if ([null, undefined, ''].includes(ws[cellRef].v)) {
                    ws[cellRef] = undefined
                }
            }
        }
    }

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

const secondMethod = function (ws) {

    const sheetrange_encoded = ws['!ref'];
    const sheetrange_decoded = XLSX.utils.decode_range(sheetrange_encoded);

    cols = { start: sheetrange_decoded.s.c, end: sheetrange_decoded.e.c }
    rows = { start: sheetrange_decoded.s.r, end: sheetrange_decoded.e.r }

    let result = `Cols: from ${cols.start} to ${cols.end} and rows from ${rows.start} to ${rows.end}`;

    // first we have to find the index of Propretie names
    const indexes = {
        id: 0,
        name: 1,
        description: 2,
        releaseDate: 3,
        shutdownDate: 4,
        cots: 7,
    }

    const allApps = [];

    for (let i = 1; i < rows.end; i++) {

        let app = {};
        let status = true;
        // if a app doesn't have a name or date then skip the row

        app.id = getCellValue(ws[XLSX.utils.encode_cell({ r: i, c: indexes.id })]);
        app.name = getCellValue(ws[XLSX.utils.encode_cell({ r: i, c: indexes.name })]);
        app.description = getCellValue(ws[XLSX.utils.encode_cell({ r: i, c: indexes.description })]);
        app.releaseDate = getCellValue(ws[XLSX.utils.encode_cell({ r: i, c: indexes.releaseDate })]);
        app.shutdownDate = getCellValue(ws[XLSX.utils.encode_cell({ r: i, c: indexes.shutdownDate })]);
        app.cots = getCellValue(ws[XLSX.utils.encode_cell({ r: i, c: indexes.cots })]);

        for (const [key, value] of Object.entries(app)) {
            if (value == undefined) {
                if (['id', 'name'].includes(key)) {
                    status = false;
                } else {
                    app[key] = null;
                }
            }
        }

        if (status) {
            allApps.push(app);
        }
    }

    return allApps;

}

const getCellValue = function (cell) {
    if (cell) {
        return cell.v;
    }
    else {
        return undefined;
    }
}





module.exports = router;