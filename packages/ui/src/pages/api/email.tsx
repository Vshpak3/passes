import mailchimp, { MemberErrorResponse } from "@mailchimp/mailchimp_marketing"
import type { NextApiRequest, NextApiResponse } from "next"
import { toast } from "react-toastify"

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us10"
})

interface EmailRequest {
  emailAddress: string
}

interface EmailException {
  response?: MemberErrorResponse
}

const F = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as EmailRequest

  if (!body.emailAddress) {
    res.status(400).send({ error: "Email must be non-empty" })
    return
  }

  try {
    const response = await mailchimp.lists.addListMember("029a9a014f", {
      email_address: body.emailAddress,
      status: "subscribed"
    })

    res.status(201).send({ status: response.status })
  } catch (e: unknown) {
    const err = e as EmailException
    const errMsg = JSON.parse(err?.response?.title || "")
    if (errMsg.title === "Member Exists") {
      res.status(200).send({})
      return
    }
    console.error(errMsg)
    toast.error(errMsg)
    res.status(501).send({ error: errMsg })
  }
}

export default F
