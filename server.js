// REQUIRE
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

// OPEN API
app.get("/", async (req, res) => {
  res.send("server is running!");
});

// CONNECTION URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dv4ff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//DB CONNECTION
async function run() {
  try {
    await client.connect();
    const database = client.db("assignment-12");
    const user_collection = database.collection("users");
    const product_collection = database.collection("products");
    const order_collection = database.collection("orders");

    //#user add: post api
    app.post("/users", async (req, res) => {
      const result = await user_collection.insertOne(req.body);
      res.json(result);
    });

    //#all products load: get api
    app.get("/products", async (req, res) => {
      const result = await product_collection.find({}).toArray();
      res.json(result);
    });

    //#single data load: get api
    app.get("/placeorder/:id", async (req, res) => {
      const result = await product_collection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    //# place order: post api
    app.post("/placeorder", async (req, res) => {
      const order = req.body;
      order.status = "Pending";
      delete order._id;
      const result = await order_collection.insertOne(order);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`server is running on port ${port}`));
