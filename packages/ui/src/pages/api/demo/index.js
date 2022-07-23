import { getConnection } from "src/helpers/demo"

const handler = async (req, res) => {
  const connection = await getConnection()
  const collection = connection.db("test").collection("creators")
  if (req.method == "GET") {
    const creators = await collection.find({}).toArray()
    return res.json(creators)
  }
  if (req.method == "POST") {
    const data = req.body
    const creator = await collection.insert(data)
    return res.json(creator)
  }
}

export default handler
