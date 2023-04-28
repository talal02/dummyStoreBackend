const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const {requireAuth} = require('./jwt');

// Connection URL and database name
const uri =
  "mongodb+srv://talal_ahmed:talal_ahmed@cluster1.i3wda6k.mongodb.net/?retryWrites=true&w=majority";
const dbName = "DummyStore";

// Create a new MongoClient
const client = new MongoClient(uri);
// Use bodyParser middleware to parse request body
app.use(bodyParser.json());
// Use cookieParser middleware to parse cookies
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));


// Define routes for handling operations

// Get all products
app.get("/products", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Find all products
  const cursor = collection.find({}).toArray();
  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting products");
  });
});

// Search Products
app.get("/products/search", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Define search query
  const query = {};
  if (req.query.title) {
    query.title = new RegExp(req.query.title, "i");
  }
  if (req.query.brand) {
    query.brand = new RegExp(req.query.brand, "i");
  }
  if (req.query.category) {
    query.category = new RegExp(req.query.category, "i");
  }

  // Find matching products
  const cursor = collection.find(query).toArray();
  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting products");
  });

});

// Limit results
app.get("/products/limit/:limit", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Find limited products
  const cursor = collection
    .find({})
    .limit(parseInt(req.params.limit))
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting products");
  });

});

// Sort results
app.get("/products/sort/:field/:order", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Define sort order
  const sortOrder = {};
  sortOrder[req.params.field] = req.params.order === "asc" ? 1 : -1;

  // Find sorted products
  const cursor = collection
    .find({})
    .sort(sortOrder)
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting products");
  });

});

// Get a single product
app.get("/products/:id", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Find the product by ID
  const cursor = collection.findOne({ id: parseInt(req.params.id) });
  cursor
  .then((response) => {
    if(!response) {
      res.status(404).send("No product found");
    } else {
      res.json(response);
    }
  })
  .catch((err) => {
    res.status(500).send("Error getting product");
  });
});

// Get all categories
app.get("/categories", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Find all categories
  const cursor = collection.distinct("category");
  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting categories");
  });
});


// Get products in category
app.get("/categories/:category/products", requireAuth, function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Find products in the specified category
  const cursor = collection
    .find({ category: req.params.category })
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting products");
  });
});

// Add new product
app.post("/products", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Insert the new product
  collection.insertOne(req.body)
  .then((response) => {
    res.send(`Product ${response.insertedId} added.`);
  }).catch((err) => {
    res.status(500).send("Error adding product");
  });
});

// Update a product
app.put("/products/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Update the product by ID
  collection.updateOne(
    { id: parseInt(req.params.id) },
    { $set: req.body })
    .then((response) => {
      if (response.matchedCount === 0) {
        res.status(404).send("Product not found");
      } else {
        res.send("Product updated");
      }
    }).catch((err) => {
      res.status(500).send("Error updating product");
    });
});

// Delete a product
app.delete("/products/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("products");

  // Delete the product by ID
  collection.deleteOne({ id: parseInt(req.params.id) })
  .then((response) => {
    if (response.deletedCount === 0) {
      res.status(404).send("Product not found");
    } else {
      res.send("Product deleted");
    }
  }).catch((err) => {
    res.status(500).send("Error deleting product");
  });
});


// Get all users
app.get("/users", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  // Find all products
  const cursor = collection.find({}).toArray();
  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting users");
  });
});

// Limit users results
app.get("/users/limit/:limit", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  // Find limited products
  const cursor = collection
    .find({})
    .limit(parseInt(req.params.limit))
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting users");
  });

});

// Sort users results
app.get("/users/sort/:field/:order", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  // Define sort order
  const sortOrder = {};
  sortOrder[req.params.field] = req.params.order === "asc" ? 1 : -1;

  // Find sorted products
  const cursor = collection
    .find({})
    .sort(sortOrder)
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting users");
  });

});

// Get a single user
app.get("/users/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  // Find the user by ID
  const cursor = collection.findOne({ id: parseInt(req.params.id) });
  cursor
  .then((response) => {
    if(!response) {
      res.status(404).send("No user found");
    } else {
      res.json(response);
    }
  })
  .catch((err) => {
    res.status(500).send("Error getting user");
  });

});

const createToken = (id) => {
  return jwt.sign({ id }, 'talal_ahmed', {
    expiresIn: 86400*3 // 3 days
  })
}

// Add new user
app.post("/users", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  console.log(req.body);
  // Insert the new user
  collection.insertOne(req.body)
  .then((response) => {
    const token = createToken(response.insertedId.toString());
    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000*3, sameSite: 'none', secure: true });
    res.status(201).json({msg: `User ${response.insertedId.toString()} added.`});
  }).catch((err) => {
    res.status(500).send("Error adding user");
  });
});

// Update a user
app.put("/users/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  // Update the user by ID
  collection.updateOne(
    { id: parseInt(req.params.id) },
    { $set: req.body })
    .then((response) => {
      if (response.matchedCount === 0) {
        res.status(404).send("User not found");
      } else {
        res.send("User updated");
      }
    }).catch((err) => {
      res.status(500).send("Error updating user");
    });
});

// Delete a user
app.delete("/users/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("users");

  // Delete the user by ID
  collection.deleteOne({ id: parseInt(req.params.id) })
  .then((response) => {
    if (response.deletedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted");
    }
  }).catch((err) => {
    res.status(500).send("Error deleting user");
  });
});

// Get all carts
app.get("/carts", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Find all carts
  const cursor = collection.find({}).toArray();
  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting carts");
  });
});

// Limit users results
app.get("/carts/limit/:limit", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Find limited products
  const cursor = collection
    .find({})
    .limit(parseInt(req.params.limit))
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting carts");
  });

});

// Sort users results
app.get("/carts/sort/:field/:order", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Define sort order
  const sortOrder = {};
  sortOrder[req.params.field] = req.params.order === "asc" ? 1 : -1;

  // Find sorted products
  const cursor = collection
    .find({})
    .sort(sortOrder)
    .toArray();

  cursor
  .then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.status(500).send("Error getting carts");
  });

});


// Get a single cart
app.get("/carts/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Find the cart by ID
  const cursor = collection.findOne({ id: parseInt(req.params.id) });
  cursor
  .then((response) => {
    if(!response) {
      res.status(404).send("No cart found");
    } else {
      res.json(response);
    }
  })
  .catch((err) => {
    res.status(500).send("Error getting cart");
  });
});

// Add new cart
app.post("/carts", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Insert the new cart
  collection.insertOne(req.body)
  .then((response) => {
    res.send(`Cart ${response.insertedId} added.`);
  }).catch((err) => {
    res.status(500).send("Error adding cart");
  });
});

// Update a cart
app.put("/carts/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Update the cart by ID
  collection.updateOne(
    { id: parseInt(req.params.id) },
    { $set: req.body })
    .then((response) => {
      if (response.matchedCount === 0) {
        res.status(404).send("Cart not found");
      } else {
        res.send("Cart updated");
      }
    }).catch((err) => {
      res.status(500).send("Error updating cart");
    });
});

// Delete a cart
app.delete("/carts/:id", function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection("carts");

  // Delete the cart by ID
  collection.deleteOne({ id: parseInt(req.params.id) })
  .then((response) => {
    if (response.deletedCount === 0) {
      res.status(404).send("Cart not found");
    } else {
      res.send("Cart deleted");
    }
  }).catch((err) => {
    res.status(500).send("Error deleting cart");
  });
});

// Login user
app.post('/login', function (req, res) {
  // Select the database
  const db = client.db(dbName);

  // Define the collection
  const collection = db.collection('users');

  // Find the user by username
  collection.findOne({ username: req.body.username })
  .then((response) => {
    if (!response) {
      res.status(404).send('User not found');
    } else {
      // Check the password
      if (response.password === req.body.password) {
        res.cookie('jwt', createToken(response._id.toString()), { httpOnly: true, secure: true, sameSite: 'none', maxAge: 86400000*3 })
        res.status(201).json({ msg: `User ${response._id.toString()} logged in`});        
      } else {
        res.status(401).send('Wrong password');
      }
    }
  }).catch((err) => {
    res.status(500).send('Error logging in');
  });
});



// Start the server
client.connect().then(() => {
  app.listen(3000, function () {
    console.log("App listening on port 3000");
  });
}).catch((err) => {
  console.error(err);
});
