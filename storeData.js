const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

// Connection URL and database name
const uri = "mongodb+srv://talal_ahmed:talal_ahmed@cluster1.i3wda6k.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const dbName = 'DummyStore';

// Connect to the MongoDB server
function run() {
    client.connect().then(() => {
      let dbo = client.db(dbName);
      console.log("Connected successfully to server");
    
      // Select the database
      // Define the collection
      let collection = dbo.collection('products');
    
      // Get Products  
      fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then((data) => {
        data.products.forEach((product) => {
            // Insert the product data into the collection
            collection.insertOne(product)
            .then((res) => {
              console.log(`Inserted ${res.insertedId} documents into the collection`);
            })
          }
        )
      });
    }).then(() => {
      let dbo = client.db(dbName);
      let collection = dbo.collection('users');
      // Get Users
      fetch('https://dummyjson.com/users')
      .then(res => res.json())
      .then((data) => {
          data.users.forEach((user) => {
              // Insert the user data into the collection
              collection.insertOne(user)
              .then((res) => {
                console.log(`Inserted ${res.insertedId} documents into the collection`);
              })
            }
          )
        }
      ).then(() => {
        let dbo = client.db(dbName);
        let collection = dbo.collection('carts');
        // Get Carts
        fetch('https://dummyjson.com/carts')
        .then(res => res.json())
        .then((data) => {
          data.carts.forEach((cart) => {
              // Insert the cart data into the collection
              collection.insertOne(cart)
              .then((res) => {
                console.log(`Inserted ${res.insertedId} documents into the collection`);
              })
            })
          })
      })
    });
    
};

run();