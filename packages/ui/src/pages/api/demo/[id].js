import { ObjectId } from "mongodb"
import { getConnection } from "src/helpers/demo"

const handler = async (req, res) => {
  const { id } = req.query
  const connection = await getConnection()
  const collection = connection.db("test").collection("creators")

  if (req.method == "GET") {
    const creator = await collection.findOne({ userId: id })
    return res.json(creator)
  }

  if (req.method == "PUT") {
    const { _id, ...data } = req.body
    console.log(_id)
    const creator = await collection.updateOne(
      { _id: ObjectId(id) },
      { $set: data }
    )
    return res.json(creator)
  }

  if (req.method == "DELETE") {
    const creator = await collection.deleteOne({ _id: ObjectId(id) })
    return res.json(creator)
  }
}

export default handler
