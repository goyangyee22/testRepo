const csv = require("csvtojson");
const fs = require("fs");

const csvFilePath = "test.csv";

const jsonFilePath = "output.json";

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2));
  });
