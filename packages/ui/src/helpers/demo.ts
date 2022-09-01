import { MongoClient, MongoClientOptions } from "mongodb"
const connectionString: string = process.env.DEMO_URI || ""

type extendedMongoOptions = MongoClientOptions & {
  useNewUrlParser: boolean
  useUnifiedTopology: boolean
}

const mongoClientOption: extendedMongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const client: MongoClient = new MongoClient(connectionString, mongoClientOption)

const getConnection: () => Promise<unknown> = () => {
  return new Promise((resolve, reject) => {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) return resolve(db)
      return reject(err)
    })
  })
}

export default getConnection
