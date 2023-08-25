const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("Hello World!"));

app.use(express.json());
const dbServices = require("./db");
const utils = require("./utils");

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  let completeRecord = await dbServices.getCompleteRecord(email, phoneNumber);
  console.log(`${completeRecord} is the complete record`);

  if (completeRecord.length > 0) {
    let response = await utils.generateResponse3(email, phoneNumber);
    console.log(`${response} is the response`);
    res.status(200).send(response);
    // res.status(200).send(completeRecord);
  } else {
    let partialRecord = await dbServices.getPartialRecord(email, phoneNumber);
    console.log(`${partialRecord} is the partial record`);
    if (partialRecord.length == 0) {
      try {
        let params = {
          email: email,
          phoneNumber: phoneNumber,
          linkPrecedence: "primary",
        };
        const createRecord = await dbServices.insertRecord(params);
        console.log(createRecord);
        console.log(`${createRecord} is the create record`);
        let response = await utils.generateResponse3(email, phoneNumber);
        console.log(`${response} is the response`);
        res.status(200).send(response);
      } catch (err) {
        console.log(err);
      }
    } else {
      if (!email || !phoneNumber) {
        let response = await utils.generateResponse3(email, phoneNumber);
        console.log(`${response} is the response`);
        res.status(200).send(response);
      } else {
        let records = [];
        partialRecord.map((record) => {
          let obj = {
            id: record.id,
            email: record.email,
            phoneNumber: record.phoneNumber,
            linkedId: record.linkedId,
            linkPrecedence: record.linkPrecedence,
          };
          records.push(obj);
        });

        let isEmailFound = false;
        let isPhoneNumberFound = false;

        let linkId = records[0].linkedId;

        if (records[0].email == email) {
          isEmailFound = true;
        }
        if (records[0].phoneNumber == phoneNumber) {
          isPhoneNumberFound = true;
        }

        for (let i = 1; i < records.length; i++) {
          if (records[i].linkPrecedence != "secondary") {
            let data = {
              id: records[i].id,
              phoneNumber: records[i].phoneNumber,
              email: records[i].email,
              linkedId: linkId,
              linkPrecedence: records[i].linkPrecedence,
            };

            const updateRecord = await dbServices.updateRecord(data);
            console.log(updateRecord);
          }

          if (!isEmailFound && records[i].email == email) {
            isEmailFound = true;
          }
          if (!isPhoneNumberFound && records[i].phoneNumber == phoneNumber) {
            isPhoneNumberFound = true;
          }
        }

        if (!isEmailFound || !isPhoneNumberFound) {
          let params = {
            email: email,
            phoneNumber: phoneNumber,
            linkPrecedence: "secondary",
            linkedId: linkId,
          };
          const createRecord = await dbServices.insertRecord(params);
          console.log(createRecord);
        }

        let response = await utils.generateResponse3(email, phoneNumber);
        console.log(`${response} is the response`);
        res.status(200).send(response);
      }
    }
  }
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
