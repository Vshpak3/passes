import type { NextApiRequest, NextApiResponse } from "next"

const IndexEndpoint = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=31536000, stale-while-revalidate"
      )

      return res.status(200).json({
        index_url: `https://${req.headers.host}/api`
      })

    default:
      res.setHeader("Allow", "GET")

      return res.status(405).json({
        statusCode: 405,
        message: `Method ${req.method} Not Allowed.`
      })
  }
}

export default IndexEndpoint
