import { MongoClient } from "mongodb"
const connectionString = process.env.DEMO_URI

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const getConnection = () => {
  return new Promise((resolve, reject) => {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) return resolve(db)
      return reject(err)
    })
  })
}

export default getConnection
