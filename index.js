// Dependencies
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const admin = require("firebase-admin");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nebgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function run() {
   try {
      await client.connect();

      const database = client.db("portfolio_data");
      const userCollection = database.collection("users");
      const projectCollection = database.collection("projects");
      console.log("connected to db");

      // GET projects
      app.get("/projects", async (req, res) => {
         const cursor = projectCollection.find({});
         const size = parseInt(req.query.size);
         let projects;
         if (size) {
            projects = await cursor.limit(size).toArray();
         } else {
            projects = await cursor.toArray();
         }
         res.send(projects);
      });

      app.get("/users", async (req, res) => {
         const cursor = userCollection.find({});
         const users = await cursor.toArray({});
         res.send(users);
      });
   } finally {
      // await client.close();
   }
}
run().catch(console.dir);

// To download from root route just give the pdf link here don't use res.send() on root api

// app.get("/", (req, res) => {
//    res.download("./resume.pdf");
// });

app.get("/", (req, res) => {
   res.send("portfolio server running");
});

app.listen(port, () => {
   console.log(`server running on port ${port}`);
});
