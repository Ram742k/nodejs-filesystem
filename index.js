const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const folderPath = path.join(__dirname, 'files');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}



// Endpoint to create a text file with current timestamp
app.get('/createFile', (req, res) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}.txt`;
    const filePath = path.join(folderPath, fileName);
    const fileContent = new Date().toString();
  
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error('Error creating file:', err);
        res.status(500).send('Error creating file');
        return;
      }
      console.log('File created successfully:', fileName);
      res.send('File created successfully');
    });
  });




// Endpoint to retrieve all text files in the folder
app.get('/getTextFiles', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        res.status(500).send('Error reading directory');
        return;
      }
  
      const textFiles = files.filter(file => file.endsWith('.txt'));
      const fileContents = [];
  
      textFiles.forEach((file, index) => {
        const filePath = path.join(folderPath, file);
  
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
          }
  
          fileContents.push({ fileName: file, content: data });
  
          
          if (fileContents.length === textFiles.length) {
            res.json(fileContents);
            console.log('Text files and contents retrieved successfully');
          }
        });
      });
  
      // If there are no text files, send an empty array
      if (textFiles.length === 0) {
        res.json(fileContents);
        console.log('No text files found');
      }
    });
  });
  
  
app.listen(3001, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3001');
  });