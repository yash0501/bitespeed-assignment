const dbServices = require("./db");

function get_unique_emails(data) {
  let temp = [];
  if (data[0].email) {
    temp.push(data[0].email);
  }

  data.slice(1).map((d) => {
    if (d.email && !temp.includes(d.email)) {
      temp.push(d.email);
    }
  });

  return temp;
}

function get_unique_phoneNumbers(data) {
  let temp = [];
  if (data[0].phoneNumber) {
    temp.push(data[0].phoneNumber);
  }

  data.slice(1).map((d) => {
    if (d.phoneNumber && !temp.includes(d.phoneNumber)) {
      temp.push(d.phoneNumber);
    }
  });

  return temp;
}

const utils = {
  async generateResponse3(email, phoneNumber) {
    let ids = new Set();
    let arr = [];
    let recordIds = await dbServices.getIdsFromEmailPhone(email, phoneNumber);
    if (recordIds.length > 0) {
      recordIds.map((record) => {
        ids.add(record.id);
        if (record.linkedId) {
          ids.add(record.linkedId);
        }
      });
    }
    arr = [...ids];
    recordIds = await dbServices.getIdsFromIds(arr);
    if (recordIds.length > 0) {
      recordIds.map((record) => {
        ids.add(record.id);
        if (record.linkedId) {
          ids.add(record.linkedId);
        }
      });
    }

    arr = [...ids];

    let previous_n = -1;

    while (previous_n < ids.size) {
      previous_n = ids.size;
      recordIds = await dbServices.getIdsFromIds(arr);

      if (recordIds.length > 0) {
        recordIds.map((record) => {
          ids.add(record.id);
          if (record.linkedId) {
            ids.add(record.linkedId);
          }
        });
      }
    }

    arr = [...ids];

    let records = await dbServices.getRecordsByIds(arr);

    let payload = {
      contact: {
        primaryContatctId: records[0].id,
        emails: get_unique_emails(records),
        phoneNumbers: get_unique_phoneNumbers(records),
        secondaryContactIds: records.slice(1).map((_) => _.id),
      },
    };
    return payload;
  },
};

module.exports = utils;
