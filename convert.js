/**
 * Converts Vimeo .csv file to .srt subtitle file
 * 
 * Vimeo timecode is formatted  > hh:mm:ss
 * Vimeo csv files contains 1 timecode field per row
 * Subtitle timecode is formatted > hh:mm:ss,ms
 * Subtitle srt files needs 2 timecode fields per row: start + end
 */

let fs = require('fs');
let Papa = require('papaparse');
let tc = require('./custom_lib/timecode.js');

const newline = '\n';
const csvFolder = './csv/';
const srtFolder = './srt/';
const doneFolder = './csv/done/';
const csvTimeCodeKey = 'Timecode';
const addTime = '00:00:02';
const ms = ',000';

let adobeStartSequence = '1' + newline;
    adobeStartSequence += '00:00:00,000 --> 00:00:00,100' + newline;
    adobeStartSequence += 'Start Sequence needed for Adobe' + newline + newline;

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

 // Converts all csv files to srt files
function startConverting(myFiles){
  for (let i = 0; i < myFiles.length; i++) {
    let newCsv  = readCsvFile(myFiles[i]);
    let sortCsv = sortByKey(newCsv, csvTimeCodeKey);
    let newSrt  = createSrtRows(sortCsv);
    let newSrtFileName = myFiles[i].replace(".csv", ".srt");
    writeSrtFile(newSrt, newSrtFileName);
    moveFile(myFiles[i]);
  }
}

// Write output as srt file
function writeSrtFile(newSrt, srtFileName){
  let srtFile = srtFolder + srtFileName;
  fs.writeFile(srtFile, newSrt, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("saved : " + srtFile);
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
  let srtSequence = adobeStartSequence;

  for (let i = 0; i < csvArray.length; i++) {
    let endTimecode = tc.addTimes(csvArray[i].Timecode, addTime);
    let srt = {};
    srt.nr        = (i + 2) + newline;
    srt.timecode  = csvArray[i].Timecode + ms + ' --> ' + endTimecode + ms + newline;
    srt.caption   = (i + 2) + ' : ' + csvArray[i].Note + newline;
    srt.newline   = newline;
    
    srtSequence += (srt.nr + srt.timecode + srt.caption + srt.newline);
  }
  return srtSequence;
}

// Sort csv array by timecode
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

