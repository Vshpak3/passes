import axios from "axios"
import React, { MouseEventHandler, useState } from "react"

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
      await axios.post("/api/email", { emailAddress })
      setEmailFeedback("Thank you for subscribing!")
    } catch (error: any) {
      setEmailFeedback("An error occurred...")
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  return (
    <div className="bg-[url('/img/homepage/hero-bkg.webp')] bg-cover bg-no-repeat">
      <div className="bg-fill mx-auto max-w-7xl overflow-clip px-4 py-24">
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
            className="my-20 mx-auto"
            src="/img/homepage/palooza.gif"
            alt="Palooza"
          />
          <p className="max-w-2xl text-center text-lg font-medium">
            Monetize your following by creating clean, exclusive,
            behind-the-scenes content on Passes.
          </p>
          <div className="mx-auto flex w-full max-w-lg flex-col py-8">
            <p className="text-center text-lg font-bold">Sign Up for Updates</p>

            <div className="flex w-full flex-grow items-center py-4">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(v) => setEmailAddress(v.target.value)}
                value={emailAddress}
                placeholder="Email address"
                className="mr-4 h-12 flex-grow rounded-lg border-2 border-white bg-transparent px-4 text-white placeholder-white"
              />
              <button
                className="rounded-sm bg-[#CF42A4] px-6 py-4 font-semibold"
                type="submit"
                onClick={handleSubmitEmail}
              >
                Join Waitlist
              </button>
            </div>
            {emailFeedback && (
              <p className="pt-6 text-center font-semibold">{emailFeedback}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
