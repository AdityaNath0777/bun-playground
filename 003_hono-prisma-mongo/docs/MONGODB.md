### MongoDB `mongosh` Cheatsheet: My Personal Notes 📝

-----

### Basic Operations

  * **Database & Collection Creation:**
    ```javascript
    use apun_ka_db // if db is not present, it will create it
    db.user // if user collection doesn't exist, it will create it
    ```
  * **Show Collections:**
    ```javascript
    show collections
    ```
  * **Rename a Collection:**
    ```javascript
    db.user.renameCollection("users")
    ```

-----

### Data Insertion

  * **Insert a Single Document:**
    ```javascript
    db.user.insertOne({ name: "Raam", age: 17 })
    // Returns: acknowledgement: true, ObjectId
    ```
  * **Insert Many Documents:**
    ```javascript
    db.user.insertMany([{ name: "Raam", age: 17 }, { name: "Shyam", age: 18 }])
    // Returns: acknowledgement: true, and an ObjectId for each inserted document
    ```

-----

### Data Retrieval (Read)

  * **Get All Documents:**

    ```javascript
    db.users.find()
    ```

  * **Count All Documents:**

    ```javascript
    db.users.find().count()
    ```

  * **Find by Condition:**

    ```javascript
    // Returns the first document that matches the condition
    db.users.findOne({ age: 17 })

    // Returns all documents that match the condition
    db.users.find({ age: 17 })
    ```

  * **Handling Large Results (The Cursor):**
    `find()` only prints the first 20 documents by default. It returns a **cursor** that you can use to get more results.

      * To print all documents:
        ```javascript
        db.users.find().forEach(x => { printjson(x) })
        ```
      * To return all documents as an array:
        ```javascript
        db.users.find().toArray()
        ```

  * **Querying with Comparison Operators:**
    Use the `$` prefix for reserved keywords.

    ```javascript
    db.users.find({ age: {
      $lt: 12,  // Less than 12
      $lte: 12, // Less than or equal to 12
      $gt: 16,  // Greater than 16
      $gte: 16  // Greater than or equal to 16
    }})
    ```

  * **Projections (Selecting Specific Fields):**

    ```javascript
    db.users.find(
      // Filter (empty object means select all documents)
      {},
      // Projection options
      {
        name: 1, // Include the 'name' field
        _id: 0   // Exclude the '_id' field (it's included by default)
      }
    )
    ```

-----

### Data Modification (Update & Delete)

  * **Updating Documents:**
    ```javascript
    // Error: Needs an atomic operator like $set
    db.users.updateOne({ name: "Naalaa" }, { age: 15 })

    // Correct way: use the $set operator
    db.users.updateOne({ name: "Naalaa" }, { $set: { age: 15 } })

    // Update multiple documents with a filter
    db.users.updateMany({ age: { $gte: 15 } }, { $set: { isEligible: true } })
    ```
  * **Deleting Documents:**
    ```javascript
    // Delete all documents that match the filter
    db.users.deleteMany({ age: { $lt: 11 } })

    // Delete the first document that matches the filter
    db.users.deleteOne({ age: 12 })

    // Delete all documents in the collection
    db.users.deleteMany({})
    ```

-----

### Database & Collection Management

  * **Drop a Collection:**
    ```javascript
    db.products_new.drop() // Returns true on success
    ```
  * **Drop the Current Database:**
    ```javascript
    db.dropDatabase() // Deletes all collections within the current database
    ```

-----

### Data Types & Schema Validation

  * **Core MongoDB Data Types:**

      * `string`, `boolean`, `number` (`integer`, `NumberLong`, `NumberDecimal`)
      * `ObjectId`, `Array`, `ISODate`, `Timestamp`, `Embedded Document`

  * **Type Checking in `mongosh`:**
    `typeof` in `mongosh` can be misleading. To get the specific MongoDB type, you need to check the `constructor.name`.

    ```javascript
    var doc = db.companyData.findOne();
    Object.entries(doc).forEach(([key, value]) => {
      print(`type of ${key}: ${value?.constructor?.name}`);
    });
    // Results:
    // type of _id: ObjectId
    // type of name: String
    // type of employees: Array
    ```

  * **Schema Validation (`$jsonSchema`):**
    You can enforce a schema when creating a collection.

    ```javascript
    // Note: If collection already exists, you must drop it first!
    db.nonfiction.drop()

    db.createCollection(
      "nonfiction",
      {
        validator: {
          $jsonSchema: {
            required: ["name", "price"],
            properties: {
              name: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              price: {
                bsonType: "number",
                description: "must be a number and is required",
              },
            },
          },
        },
        validationAction: "error" // Default behavior is 'error'
      }
    )
    ```

-----

### Advanced Commands

  * **`collMod` (Modify a Collection):**
    Use this command to modify the validation rules of an **existing** collection.
    ```javascript
    db.runCommand({
      collMod: "nonfiction",
      validator: {
        $jsonSchema: {
          required: ["name", "price", "authors"],
          // ... new properties and rules
        }
      },
      validationAction: "error"
    })
    ```
  * **`writeConcern` (Insert Options):**
    Control the durability of your write operations.
    ```javascript
    db.nonfiction.insertMany(
      [{ name: "yo", price: 891, authors: [{ name: "hehe", email: "hehe@mail.com" }] }],
      {
        writeConcern: {
          w: 0,         // Don't wait for acknowledgment from the server
          j: true,      // Maintain a journal
          wtimeout: 2000 // Abort if write takes longer than 2 seconds
        },
        ordered: true   // Insert documents in the array order
      }
    )
    ```

-----

### Replication Set Setup (Local)

1.  Create separate data directories: `db1`, `db2`, `db3`.

2.  Start three separate `mongod` instances on different ports with unique `dbpath`s.

    ```bash
    # Terminal 1
    mongod --port 27018 --dbpath "/path/to/db1" --replSet rs1

    # Terminal 2
    mongod --port 27019 --dbpath "/path/to/db2" --replSet rs1

    # Terminal 3
    mongod --port 27020 --dbpath "/path/to/db3" --replSet rs1
    ```

3.  Open a new terminal and connect to one of the instances (e.g., `27018`).

    ```bash
    mongosh --port 27018
    ```

4.  Initiate the replica set from that `mongosh` shell.

    ```javascript
    rs.initiate({
      _id: "rs1",
      members: [
        { _id: 0, host: "localhost:27018" },
        { _id: 1, host: "localhost:27019" },
        { _id: 2, host: "localhost:27020" },
      ]
    })
    ```

      * **Pro-Tip:** The first member in the array (or the one you ran `rs.initiate()` from) often becomes the **primary** node. Use `rs.status()` to confirm the roles.

5.  **Replication Rules:**

      * The **primary** node handles both **reads and writes**.
      * **Secondary** nodes are **read-only** by default. Trying to write to a secondary will result in a `MongoServerError[NotWritablePrimary]: not primary` error.