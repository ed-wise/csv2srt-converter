let fs = require('fs');
let Papa = require('papaparse');
let tc = require('./custom_lib/timecode.js');

const newline = '\n';
const csvFolder = './csv/';
const srtFolder = './srt/';
const doneFolder = './csv/done/';

const csvTimeCodeKey = 'Timecode';
const addTime = '00:00:02';


// let csvFile = csvFolder + 'burnout.csv';
let myFiles = [];

let start = new Date().getTime();

myFiles = readCsvFolder();

if(myFiles.length == 0){
  console.log('No .csv files found in /csv/ folder');
  return
}else{
  console.log('Total .csv files: '+ myFiles.length);
  startConverting(myFiles);
  let elapsed = new Date().getTime() - start;
  console.log("Duration in ms: " + elapsed);
}

/**
 * FUNCTIONS
 */

 // Converts all csv files to srt files
function startConverting(myFiles){
  for (let i = 0; i < myFiles.length; i++) {
    let contentCsv = readCsvFile(myFiles[i]);
    writeSrtFile(contentCsv, myFiles[i]);
    moveFile(myFiles[i]);
  }
}

// 1. Sort csv array bij timecode
// 2. Create 
function writeSrtFile(rows, csvFile){
  let sortRows    = sortByKey(rows, csvTimeCodeKey);
  let mySrt       = createSrtRows(sortRows);
  let srtFileName = csvFile.split(".");
  fs.writeFile(srtFolder + srtFileName[0] + ".srt", mySrt, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("saved : " + srtFolder + srtFileName[0] + '.srt');
  }); 
}

function moveFile(csvfile){
  let oldFile = csvFolder + csvfile;
  let newFile = doneFolder + csvfile;
  fs.rename(oldFile, newFile, (err) => {
    if (err) throw err;
    console.log('moved ' + oldFile + ' to ' + newFile);
  });
}

// Read content in csv folder and create array of .csv filenames
function readCsvFolder() {
  fs.readdirSync(csvFolder).forEach(file => {
    let f = file.split(".");
    if (f[1] == 'csv') { myFiles.push(file); }
  });
  return myFiles;
}

// Read content of a csv file and convert it to a csv array
function readCsvFile(csvFile) {
  let csv = csvFolder + csvFile,
    content = fs.readFileSync(csv, "utf8"),
    rows;
  Papa.parse(content, {
    header: true,
    delimiter: "",
    skipEmptyLines: "greedy",
    complete: function (results) {
      rows = results.data;
    }
  });
  return rows;
}

// Convert csv array to subtitle sequences (srt standard)
function createSrtRows(csvArray){
  let sq = '';
  let length = csvArray.length;   
  for (let i = 0; i < length; i++) {
    var endTimecode = tc.addTimes(csvArray[i].Timecode, addTime);
    sq += (i + 1) + newline;
    sq += (csvArray[i].Timecode + ',000' + ' --> ' + endTimecode) + ',000' + newline;
    sq += csvArray[i].Note + newline;
    sq += newline;
  }
  return sq;
}

// Sort csv array by timecode
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

