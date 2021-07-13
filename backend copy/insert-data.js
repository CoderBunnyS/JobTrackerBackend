const { MongoClient } = require("mongodb");
require('dotenv').config()

// Atlas connection string                                                                                                                                        
//const url = "mongodb+srv://TrackerAdmin:TrackerAdminPassword@TrackerDatabase.euzmb.mongodb.net/TrackerDatabase?retryWrites=true&w=majority"
//var url = "http://localhost:4000/";
var url = process.env.MONGODB_URI;

const client = new MongoClient(url);
 
 // The database to use
 const dbName = "JobTracker";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

         // Use the collection "user"
         const col = db.collection("user");

         // Construct a document                                                                                                                                                              
         let userDocument = {
             "firstName": {"firstName": "Alan"}, 
             "lastName": {"lastName": "Turing" },                                                                                                                                
             "username": {"username": "username"},  
             "email": {"email": "email@email.com"}
         }

         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(userDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);

