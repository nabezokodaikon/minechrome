"use strict"

const path = require("path");
const fs = require("fs");
const Datastore = require("nedb");
const Immutable = require("immutable");

function historyTest() {
  const dbFile = path.join(__dirname, "db/minechrome-history.db");
  console.log(dbFile);

  if (fs.existsSync(dbFile)) {
    console.log("Database file exists");
  } else {
    console.log("Database file not exists");
  }

  const db = new Datastore({ filename: dbFile });
  db.loadDatabase((err) => {
    if(err) {
      console.log(err);
    }
  });

  const doc1 = {
    url: "hoge1",
    date: Date.now() - 1000000000
  };

  const doc2 = {
    url: "hoge foo1",
    date: Date.now() - 200000000
  };

  const doc3 = {
    url: "bar1",
    date: Date.now() - 30000000
  };

  db.update(
      { url: doc1.url },
      { url: doc1.url, date: doc1.date },
      { upsert: true },
      (err, numReplaced, upsert) => {
        if (err) {
          console.log("doc1 update filed: " + err);
        }
      });
  
  db.update(
      { url: doc2.url },
      { url: doc2.url, date: doc2.date },
      { upsert: true },
      (err, numReplaced, upsert) => {
        if (err) {
          console.log("doc2 update filed: " + err);
        }
      });

  db.update(
      { url: doc3.url },
      { url: doc3.url, date: doc3.date },
      { upsert: true },
      (err, numReplaced, upsert) => {
        if (err) {
          console.log("doc3 update filed: " + err);
        }
      });

  db.find(
      { },
      (err, docs) => {
        if (err) {
          console.log("filed: " + err);
          return;
        }

        console.log(docs);
      });

  db.find({}).sort({ date: -1 }).exec((err, docs) => {
    if (err) {
      console.log("filed: " + err);
      return;
    }

    console.log(docs);
  });

  db.find({ url: { $regex: /hoge/ }}).sort({ date: -1 }).exec((err, docs) => {
    if (err) {
      console.log("filed: " + err);
      return;
    }

    console.log(docs);
  });

  // and searching
  db.find({ $and: [{url: { $regex: /hoge/ }}, {url: { $regex: /foo/ }}]}).sort({ date: -1 }).exec((err, docs) => {
    if (err) {
      console.log("filed: " + err);
      return;
    }

    console.log(docs);
  });

  const keywords = ["hoge", "foo"];
  



  

  return;
  db.findOne(
      { url: doc1.url },
      (err, doc) => {
        if (err) {
          console.log("doc1 update filed: %s", err);
          return;
        }

        console.log("url: %s, date: %d, toString(): %s", doc.url, doc.date, new Date(doc.date).toLocaleString());
      });

  
  db.update(
      { url: doc1.url },
      { url: doc1.url, date: Date.now() },
      { upsert: true },
      (err, numReplaced, upsert) => {
        if (err) {
          console.log("doc1 update filed: " + err);
        }
      });

  db.update(
      { url: doc2.url },
      { url: doc2.url, date: Date.now() },
      { upsert: true },
      (err, numReplaced, upsert) => {
        if (err) {
          console.log("doc2 update filed: " + err);
        }
      });

  db.update(
      { url: doc3.url },
      { url: doc3.url, date: Date.now() },
      { upsert: true },
      (err, numReplaced, upsert) => {
        if (err) {
          console.log("doc3 update filed: " + err);
        }
      });

  db.findOne(
      { url: doc1.url },
      (err, doc) => {
        if (err) {
          console.log("doc1 update filed: %s", err);
          return;
        }

        console.log("url: %s, date: %d, toString(): %s", doc.url, doc.date, new Date(doc.date).toLocaleString());
      });
}

historyTest();

// const doc = {
  // _id: "12345678901234567",
  // word: "helo!"
// };

// db.findOne({ _id: "12345678901234567" }, (err, doc) => {
  // if (err) {
    // console.log("findOne filed:", + err);
    // return;
  // }

  // console.log(doc);
// });

// db.insert(doc, (err, newDoc) => {
  // if (err) {
    // console.log("Insert filed: " + err);
    // return;
  // }
// });

// db.find({ _id: "12345678901234567" }, (err, docs) => {
  // if (err) {
    // console.log("Find filed: " + err);
  // }

  // console.log(docs);
// });
