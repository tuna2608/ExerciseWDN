const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';
const dboper = require('./operations');

MongoClient.connect(url).then((client) => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    // dboper.insertDocument(db, { name: "Vadonut2", description: "Test2"},
    //     "dishes")
    //     .then((result) => {
    //         console.log("Insert Document:\n", result.ops);

    //         return dboper.findDocuments(db, "dishes");
    //     })
    //     .then((docs) => {
    //         console.log("Found Documents:\n", docs);

    //         return dboper.updateDocument(db, { name: "Vadonut" },
    //                 { description: "Updated Test2" }, "dishes");

    //     })
    //     .then((result) => {
    //         console.log("Updated Document:\n", result.result);

    //         return dboper.findDocuments(db, "dishes");
    //     })
    //     .then((docs) => {
    //         console.log("Found Updated Documents:\n", docs);

    //         // return db.dropCollection("dishes");
    //     })
    //     // .then((result) => {
    //     //     console.log("Dropped Collection: ", result);

    //     //     return client.close();
    //     // })
    //     // .catch((err) => console.log(err));

    dboper.insertDocument(db, {
        name: "Weekend Grand Buffet",
        image: "images/buffet.png",
        label: "New",
        price: "19.99",
        description: "Featuring . . .",
        featured: false
    },
        "promotions")
        .then((result) => {
            console.log("Insert Document:\n", result.ops);
            return dboper.findDocuments(db, "promotions");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);
            return dboper.updateDocument(db, { name: "Weekend Grand Buffet" },
                { description: "Updated Test2" }, "promotions");
        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);
            return dboper.findDocuments(db, "promotions");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);

            // return db.dropCollection("promotions");
        })
    // .then((result) => {
    //     console.log("Dropped Collection: ", result);

    //     return client.close();
    // })
    // .catch((err) => console.log(err));
})
    .catch((err) => console.log(err));