const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const { Pool } = require("pg");

const db = new Pool({
  host: "database-1.c2uvhi87rnky.us-east-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "bixi",
});

db.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to database");
  }
});

app.use(express.json());

const cors = require("cors");
const { query } = require("express");
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  session({
    store: new pgSession({
      pool: db,
      tableName: "sessions",
    }),
    secret: "this-is-a-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }, // 30 days
  })
);

app.use((req, res, next) => {
  console.log("session", req.session);
  next();
});

function authMiddleware(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({ error: "Unauthorized" });
    next();
    return;
  }
  next();
}

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/me", authMiddleware, async (req, res) => {
  console.log("req.session.user", req.session.user);

  if (!req.session.user) {
    res.status(401).end();
    return;
  }

  console.log("here?");
  res.json(req.session?.user);
});

app.get("/admin/bikes", (req, res) => {
  const query = "SELECT * FROM bikes";
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).render("admin-bikes", { bikes: result.rows });
  });
});

app.post("/register", async (req, res) => {
  console.log("registered as", req.body.firstname);

  try {
    const { firstname, lastname, email, password } = req.body;

    const selectText = "SELECT * FROM users WHERE email = $1";
    const selectValues = [req.body.email];

    const selectResult = await db.query(selectText, selectValues);

    if (selectResult.rowCount > 0) {
      res.status(400).send("User already exists");
      return;
    }

    const salt = bcrypt.genSaltSync(10); // encrypt password
    const hashedPassword = bcrypt.hashSync(password, salt);

    const query = `INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(query, [
      email,
      hashedPassword,
      firstname,
      lastname,
    ]);

    req.session.user = {
      id: result.rows[0].id,
    };
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

app.post("/login", async (req, res) => {
  console.log("login", req.body.email);

  try {
    const selectText =
      "SELECT id, email, password, firstname FROM users WHERE email = $1";
    const selectValues = [req.body.email];

    const selectResult = await db.query(selectText, selectValues);

    if (selectResult.rowCount === 0) {
      res.status(400).send("User does not exist");
      return;
    }

    if (!bcrypt.compareSync(req.body.password, selectResult.rows[0].password)) {
      res.status(401).send("Incorrect password");
      return;
    }
    const id = selectResult.rows[0].id;
    const message = `Welcome ${selectResult.rows[0].firstname}! Please pick a location and bike to reserve.`;
    console.log(id, message);

    res.status(200).json({ id: id, message: message });
  } catch (err) {
    res.status(500).send("Login failed");
  }
});

app.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.clearCookie("connect.sid");
    res.status(200).send("Logged out user");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
  console.log("logged out");
});

app.post("/rentals", async (req, res) => {
  console.log("rent", req.body);
  try {
    const { user_id, location_id, bike_id } = req.body;
    await db.query(
      `INSERT INTO rentals ( user_id, location_id, bike_id, start_time) VALUES ($1, $2, $3, NOW())`,
      [user_id, location_id, bike_id]
    );
    await db.query(`UPDATE bikes SET available = True WHERE id = $1`, [
      bike_id,
    ]);
    res.status(201).send("Bike rented successfully");
  } catch (err) {
    res.status(500).send("Error renting bike");
  }
});

app.put("/return", async (req, res) => {
  console.log("return", req.body);
  try {
    const { user_id, bike_id, new_location_id } = req.body;
    await db.query(
      `UPDATE rentals SET end_time = NOW(), rental_time = EXTRACT(EPOCH FROM NOW() - start_time), location_id = $3 WHERE user_id = $1 AND bike_id = $2`,
      [user_id, bike_id, new_location_id]
    );
    await db.query(
      `UPDATE bikes SET location_id = $1, available = True WHERE id = $2`,
      [new_location_id, bike_id]
    );

    res.status(201).send("Bike returned successfully");
  } catch (err) {
    res.status(500).send("Error returning bike");
  }
});

app.get("/rentals", (req, res) => {
  console.log("rentals");
  const query = "SELECT * FROM rentals";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error getting rentals");
      return;
    }
    const log = res.json(result.rows);
    res.status(200);
  });
});
app.get("/bikes", async (req, res) => {
  console.log("getting bikes", req.body);

  try {
    const result = await db.query("SELECT * FROM bikes");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send("Bikes not found");
  }
});

app.get("/users", (req, res) => {
  console.log("users", req.body);
  const query = "SELECT * FROM users";

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
      return;
    }

    res.json(result.rows);
    res.status(200);
  });
});

app.put("/bikes/:id", async (req, res) => {
  console.log("bike damage", req.body);

  try {
    const id = req.params.id;
    const { damage } = req.body;
    await db.query(`UPDATE bikes SET damage = $1 WHERE id = $2`, [damage, id]);
    res.status(201).send("Bike damage updated successfully");
  } catch (err) {
    res.status(500).send(`Error updating bike damage`);
  }
});

//wokrs on the RentOption2
app.get("/locations", (req, res) => {
  const query = "SELECT * FROM locations";

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data");
      return;
    }

    res.json(result.rows);
  });
});
// this is for returning bikes
app.get("/bikes2/:location_id", async (req, res) => {
  const location_id = req.params.location_id;
  const query = `SELECT id, name, location_id from bikes 
  where location_id = ${location_id} and available = true and damage = false`;
  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

// this is the GET where the user inputs the bike_code into the rent or return input field
// and returns the location_id and bike_id

app.get("/rentals/:bike_code", async (req, res) => {
  try {
    const bike_code = req.params.bike_code;
    const result = await db.query(
      "SELECT location_id, bike_id FROM rentals WHERE bike_code = $1",
      [bike_code]
    );
    console.log(result);
    await db.query(
      "UPDATE bikes SET location_id = $1, available = false WHERE id = $2 RETURNING *",
      [result.rows[0].location_id, result.rows[0].bike_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Bike Code error");
  }
});

// this is the PUT that uses the bike_id to update the available status in the bikes table

app.put("/rentals/:bike_code", async (req, res) => {
  try {
    const bike_code = req.params.bike_code;
    console.log("bike_code", bike_code);
    const result = await db.query(
      "SELECT location_id, bike_id FROM rentals WHERE bike_code = $1",
      [bike_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error returning bike");
  }
});
// this is the return bike route
// this is the PUT request that updates the rentals table with the new location_id and end_time

app.put("/return/:bike_code", async (req, res) => {
  try {
    const bike_code = req.params.bike_code;
    const location_id = req.body.location_id;
    const bike_id = await db.query(
      "SELECT bike_id FROM rentals WHERE bike_code = $1",
      [bike_code]
    );
    const update = await db.query(
      "UPDATE rentals SET location_id = $1, end_time = NOW(), rental_time = EXTRACT(EPOCH FROM NOW() - start_time) WHERE bike_code = $2 RETURNING *",
      [location_id, bike_code]
    );
    await db.query(
      "UPDATE bikes SET location_id = $1, available = true WHERE id = $2 RETURNING *",
      [location_id, bike_id.rows[0].bike_id]
    );
    res.json(update.rows[0]);
  } catch (err) {
    res.status(500).send("Error returning bike");
  }
});

// this POST is an update to /rentals2 to include the bike_code, it still needs to edited to not include the start_time
// it is associated with the button clicked after choosing the location and the bike, it still need to be modified

app.post("/rentals3", async (req, res) => {
  console.log("rent", req.body);
  try {
    const { user_id, location_id, bike_id, bike_code } = req.body;
    const query =
      "INSERT INTO rentals (user_id, location_id, bike_id, bike_code, start_time) VALUES ($1, $2, $3, $4, NOW()) RETURNING *";
    const result = await db.query(query, [
      user_id,
      location_id,
      bike_id,
      bike_code,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error renting Bike" });
  }
});

app.post("/rentals2", async (req, res) => {
  try {
    const { user_id, location_id, bike_id, start_time } = req.body;
    const query =
      "INSERT INTO rentals (user_id, location_id, bike_id, start_time) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await db.query(query, [
      user_id,
      location_id,
      bike_id,
      start_time,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/bikes/button1/:id", (req, res) => {
  console.log("updating bike", req.params.id);
  const id = req.params.id;
  const query = `UPDATE bikes SET available = false WHERE id = ${id};`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating bike");
      return;
    }
    res.status(200).send("Bike updated successfully");
  });
});

app.put("/bikes/button2/:id", (req, res) => {
  console.log("updating bike", req.params.id);
  const id = req.params.id;
  const query = `UPDATE bikes SET available = true WHERE id = ${id};`;
  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating bike");
      return;
    }
    res.status(200).send("Bike updated successfully");
  });
});

app.post("/locationsHub", (req, res) => {
  console.log("adding location", req.body);
  const query = `INSERT INTO locations (hub_location) VALUES ($1)`;
  db.query(query, [req.body.hub_location], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding location");
      return;
    }
    res.status(200).send("Location added successfully");
  });
});

app.post("/bikes", (req, res) => {
  console.log("adding bike", req.body);
  const query = `INSERT INTO bikes (name) VALUES ($1)`;
  db.query(query, [req.body.name], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding bike");
      return;
    }
    res.status(200).send("Bike added successfully");
  });
});

//admin update bike location
app.patch("/bikes/:id", (req, res) => {
  console.log("updating bike to location", req.params.id);
  const id = req.params.id;
  const query = `UPDATE bikes SET location_id = $1 WHERE id = ${id};`;
  db.query(query, [req.body.location_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating bike", err);
      return;
    }
    res.status(200).send("Bike updated successfully");
  });
});

//find the user id in the users table
app.get("/users2/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const query = `SELECT id from users where id = ${user_id};`;
  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data");
  }
});

app.put("/bikesreport/:id", async (req, res) => {
  console.log("bike damage", req.body);

  try {
    const id = req.params.id;
    await db.query(`UPDATE bikes SET damage = True WHERE id = ${id};`);
    res.status(201).send("Bike damage updated successfully");
  } catch (err) {
    res.status(500).send(`Error updating bike damage`);
  }
});


app.listen(3333, () => {
  console.log("Server listening on port 3333");
});
