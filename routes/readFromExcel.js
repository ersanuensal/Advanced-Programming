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
const reader = require('xlsx');

const csv = require('@fast-csv/parse');
const router = new Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/appsFromCsv/');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${Date.now()}-${originalname}`);
    }
})

const upload = multer({ storage: storage });

router.post('/', upload.single('inpFile'), function (req, res) {
    const filePath = req.file.path;

    const workbook = reader.readFile(filePath);
    const worksheet = workbook.Sheets["Applications"];

    const applications = reader.utils.sheet_to_json(worksheet);

    res.send({
        status: 'ok',
        data: applications
    });

    fs.unlinkSync(req.file.path);
    /**
     * read from csv
     */

    // csv.parseFile(req.file.path)
    //     .on("data", data => fileRows.push(data))
    //     .on("end", function () {
    //         fs.unlinkSync(req.file.path);
    //         console.log(fileRows);
    //         res.send({
    //             satatus: 'Application imported successfully',
    //             data: fileRows
    //         });
    //     });
});



module.exports = router;