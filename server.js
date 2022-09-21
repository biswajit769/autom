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

    try {
      //const { email, firstName } = req.body;
      //const user = new User({ email, firstName });
      //const ret = await user.save();
      //res.json(ret);
      //const cleanfolderresp = await cleanfolder();
      //console.log("cleanfolderrespresult===", cleanfolderresp);
      const fileuploadres = await fileupload(req.file);
      //console.log("result===", fileuploadres);
      const fileextractres = await fileextract(
        fileuploadres.filename,
        fileuploadres.path
      );
      //console.log("fileextract result===", fileextractres);
      const filelist = await readfiles();
      //console.log("filelist", filelist);
    //   filelist.forEach((file) => {
    //     console.log(file);
    //   });
      for (const file of filelist) {
        const contents = await getPDF(file);
        const uploadinv = await uploadinvoice(contents, JSON.parse(process.env.USER_DETAIL), file);
        console.log("file==",file,"upload details====",uploadinv);
      }
      //const cleanfolderresp = await cleanfolder();
      //console.log("cleanfolderrespresult===", cleanfolderresp);
    } catch (error) {
    console.log("error block===",error);
    }
    // const file = req.file
    // if (!file) {
    //     const error = new Error('Please upload a file')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    // res.send(file)
})




