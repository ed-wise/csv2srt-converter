# csv2srt Converter

Build with node.js

## 1. Features

1. Converts all vimeo .csv files in folder './csv' to .srt subtitle files
2. Places .srt files in folder './srt'
3. Moves the converted .csv files to folder './csv/done'
----
## 2. Running Locally

Make sure you have installed: 
- [Node.js](http://nodejs.org/)
- [Npm](https://www.npmjs.com/)

```sh
git clone https://github.com/ewisenl/csv2srt-converter.git # or clone your own fork
cd csv2srt-converter
npm install
node converter.js
```
----
## 2. Windows executable
_Npm package [pkg](https://www.npmjs.com/package/pkg) is used to package this Node.js project into an executable that can be run even on devices without Node.js installed._

### 2.1 Create a new build
```
pkg convert.js
```

### 2.2 Latest build as zip file
- The latest build can be found as an .zip file in de folder  ./latest-build/csvconverter.zip

### 2.3 Installing and running the latest build
1. Unzip the file to a folder
2. Place your vimeo csv files in de folder ./csv
3. Start the .exe file

