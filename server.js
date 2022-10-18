// Require all packages installed
const express = require('express')
const multer = require('multer');
const fs = require('file-system');
const dotenv = require("dotenv");
const cors = require("cors");
const uploadinvoice = require('./uploadinvoice');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const {fileupload, fileextract, readfiles, cleanfolder, getPDF} = require('./helper');
dotenv.config();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
      //console.log("file details===",file);
      cb(null, file.fieldname + '-' + Date.now()+'.zip')
  }
})

var upload = multer({ storage: storage });

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  app.post('/uploadfile', upload.single('myFile'), async(req, res, next) => {
    let consolidateResp = [];
    var filetouploadList = [];
    try {
      
      const fileuploadres = await fileupload(req.file);
      const fileextractres = await fileextract(
        fileuploadres.filename,
        fileuploadres.path
      );
      const filelist = await readfiles();
      console.log("all files====",filelist);
      for (const file of filelist) {
        const contents = await getPDF(file);
        filetouploadList.push({
          "contents":contents,
          "file":file,
        })
        //const uploadinv = await uploadinvoice(contents, JSON.parse(process.env.USER_DETAIL), file);
        //console.log("file==",file,"upload details====",uploadinv);
        //consolidateResp.push({'status':uploadinv,'file':file});
      }
      const uploadinv = await uploadinvoice(filetouploadList, JSON.parse(process.env.USER_DETAIL));
      console.log("file content list===",uploadinv);
      //const cleanfolderres = await cleanfolder();
      //console.log("clean result====",cleanfolderres);
      res.status(200).json({"listofupload":uploadinv});
    } catch (error) {
    console.log("error block===",error);
    const filelist = await readfiles();
    console.log("error block filelist===",filelist);
    for (const file of filelist) {
      const contents = await getPDF(file);
      filetouploadList.push({
        "contents":contents,
        "file":file,
      })
      //const uploadinv = await uploadinvoice(contents, JSON.parse(process.env.USER_DETAIL), file);
      //console.log("file==",file,"upload details====",uploadinv);
      //consolidateResp.push({'status':uploadinv,'file':file});
    }
    const uploadinverror = await uploadinvoice(filetouploadList, JSON.parse(process.env.USER_DETAIL));
    console.log("file content list uploadinverror===",uploadinverror);
    res.status(200).json({"listofupload":uploadinverror});
    //return res.end("Error in processing");
    }
    // const file = req.file
    // if (!file) {
    //     const error = new Error('Please upload a file')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    // res.send(file)
})
  app.listen(process.env.PORT, () => {
    console.log('Server started on port',process.env.PORT);
  });
}






