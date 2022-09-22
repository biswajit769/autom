// Require all packages installed
const express = require('express')
const multer = require('multer');
const fs = require('file-system');
const dotenv = require("dotenv");
const cors = require("cors");
const uploadinvoice = require('./uploadinvoice');
const {fileupload, fileextract, readfiles, cleanfolder, getPDF} = require('./helper');
dotenv.config();
// const MongoClient = require('mongodb').MongoClient
// const ObjectId = require('mongodb').ObjectId;
// const myurl = 'mongodb://localhost:27017';

//CREATE EXPRESS APP
const app = express();
app.use(express.json());
app.use(cors());

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        //console.log("file details===",file);
        cb(null, file.fieldname + '-' + Date.now()+'.zip')
    }
})

var upload = multer({ storage: storage })
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/uploadfile', upload.single('myFile'), async(req, res, next) => {
    let consolidateResp = [];
    try {
      
      const fileuploadres = await fileupload(req.file);
      const fileextractres = await fileextract(
        fileuploadres.filename,
        fileuploadres.path
      );
      const filelist = await readfiles();
      for (const file of filelist) {
        const contents = await getPDF(file);
        const uploadinv = await uploadinvoice(contents, JSON.parse(process.env.USER_DETAIL), file);
        console.log("file==",file,"upload details====",uploadinv);
        consolidateResp.push({'status':uploadinv,'file':file});
      }
      const cleanfolderres = await cleanfolder();
      console.log("clean result====",cleanfolderres);
      res.status(200).json({"listofupload":consolidateResp});
    } catch (error) {
    console.log("error block===",error);
    return res.end("Error in processing");
    }
    // const file = req.file
    // if (!file) {
    //     const error = new Error('Please upload a file')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    // res.send(file)
})




