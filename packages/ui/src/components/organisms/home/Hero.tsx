import axios from "axios"
import React, { MouseEventHandler, useState } from "react"

import { isProd } from "src/helpers/env"

export const Hero = () => {
  const [emailAddress, setEmailAddress] = useState("")
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState("")

  const handleSubmitEmail: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault()

    if (isSubmittingEmail) {
      return
    }

    if (!emailAddress) {
      setEmailFeedback("Please provide an email address!")
      return
    }

    setIsSubmittingEmail(true)

    try {
      if (isProd) {
        await axios.post("/api/email", { emailAddress })
      }
      setEmailFeedback("Thank you for subscribing!")
    } catch (error: unknown) {
      setEmailFeedback("An error occurred...")
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  return (
    <div className="bg-[url('/img/homepage/hero-bkg.webp')] bg-cover bg-no-repeat">
      <div className="mx-auto max-w-7xl text-clip px-4 py-24">
        <div className="flex flex-col items-center space-y-8">
          <a href="https://jobs.lever.co/Passes">
            <span
              className="mx-auto cursor-pointer rounded-full px-4 py-2"
              style={{
                backgroundImage:
                  "linear-gradient(88deg, #f2bd6c, #bd499b 65%, #a359d5)"
              }}
            >
              We&apos;re hiring! See Open positions
            </span>
          </a>
          <h3 className="mx-auto max-w-lg text-center text-5xl font-extrabold leading-[3.5rem]">
            Exclusive Content from creators to fans
          </h3>
          <img
            alt="Palooza"
            className="my-20 mx-auto"
            src="/img/homepage/palooza.gif"
          />
          <p className="max-w-2xl text-center text-lg font-medium">
            Welcome to Passes.
          </p>
          <div className="mx-auto flex w-full max-w-lg flex-col py-8">
            <p className="text-center text-lg font-bold">Sign Up for Updates</p>

            <div className="flex w-full grow items-center py-4">
              <input
                autoComplete="email"
                className="mr-4 h-14 grow rounded-lg border-2 border-white bg-transparent px-4 text-white placeholder:text-white"
                id="email"
                name="email"
                onChange={(v) => setEmailAddress(v.target.value)}
                placeholder="Email address"
                type="email"
                value={emailAddress}
              />
              <button
                className="rounded-lg bg-[#CF42A4] px-6 py-4 font-[500]"
                onClick={handleSubmitEmail}
                type="submit"
              >
                Join Waitlist
              </button>
            </div>
            {!!emailFeedback && (
              <p className="pt-6 text-center font-[500]">{emailFeedback}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
