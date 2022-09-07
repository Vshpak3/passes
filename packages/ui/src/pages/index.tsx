import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast, ToastContent } from "react-toastify"
import { IntercomProvider } from "react-use-intercom"
import CardCarousel from "src/components/molecules/CardCarousel"
import LandingIcon from "src/icons/landingIcon"

const HomePage = () => {
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState("")
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState("")

  const routeToLogin = () => router.push("/login")

  const handleSubmitEmail = async () => {
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
    } catch (err) {
      toast.error(err as ToastContent<unknown>)
      setEmailFeedback("An error occurred...")
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  useEffect(() => {
    router.prefetch("/login")
  }, [router])

  return (
    <IntercomProvider
      appId={process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? ""}
      autoBoot
    >
      <div className="dark:bg-jacarta-900 font-body text-jacarta-500 relative z-10 overflow-x-hidden bg-white">
        <section className="relative pb-10 pt-20 md:pt-32 lg:h-[88vh]">
          <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 select-none dark:hidden">
            <img src="img/gradient.jpg" alt="gradient" />
          </picture>
          <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden select-none dark:block">
            <img src="img/gradient_dark.jpg" alt="gradient dark" />
          </picture>

          <div className="big-container h-full px-10">
            <div className="grid h-full items-center gap-4 md:grid-cols-12">
              <div className="col-span-6 flex h-full flex-col items-center justify-center py-10 md:items-start md:py-20 xl:col-span-4">
                <h1 className="text-jacarta-700 font-display mb-6 text-center text-5xl dark:text-white md:text-left lg:text-6xl xl:text-7xl">
                  Passes
                </h1>
                <p className="dark:text-jacarta-200 mb-8 text-center text-lg md:text-left">
                  All access to your favorite creators
                </p>
                <div className="flex space-x-4">
                  <a
                    target="_blank"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdJrllGUTEc9IKbx-bcS9J9t0kplgdAx7Bn3vg2ecNfFf5aFQ/viewform"
                    className="shadow-accent-volume hover:bg-accent-dark w-36 rounded-full bg-accent py-3 px-8 text-center font-semibold text-white transition-all"
                    rel="noreferrer"
                  >
                    Waitlist
                  </a>
                  <a
                    target="_blank"
                    href="https://jobs.lever.co/Passes"
                    className="shadow-white-volume hover:bg-accent-dark hover:shadow-accent-volume w-36 rounded-full bg-white py-3 px-8 text-center font-semibold text-accent transition-all hover:text-white"
                    rel="noreferrer"
                  >
                    Jobs
                  </a>
                </div>
              </div>

              <div className="col-span-6 xl:col-span-8">
                <div className="relative select-none text-center md:ml-28 md:pl-4 md:text-right">
                  <LandingIcon />
                  <Image
                    src="/img/hero/3D_elements.png"
                    alt=""
                    layout="fill"
                    className="animate-fly absolute top-0 md:-right-[10%]"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-10 pb-24">
          <div className="big-container">
            <h2 className="font-display text-jacarta-700 mb-8 text-center text-3xl dark:text-white">
              <span className="mr-1 inline-block h-6 w-6 bg-[url(https://cdn.jsdelivr.net/npm/emoji-datasource-apple@7.0.2/img/apple/64/1f525.png)] bg-contain bg-center text-xl"></span>
              Backed by
            </h2>
            <CardCarousel />
          </div>
          {process.env.NEXT_PUBLIC_NODE_ENV !== "prod" && (
            <div className="align-items mx-auto flex justify-center">
              <button
                type="button"
                onClick={routeToLogin}
                className="shadow-accent-volume hover:bg-accent-dark mt-20 w-36 rounded-full border-none bg-accent py-3 px-8 text-center font-semibold text-white transition-all"
              >
                Login
              </button>
            </div>
          )}
          <p className="text-jacarta-700 mx-auto mt-20 max-w-2xl text-center text-lg dark:text-white">
            Join our mailing list to stay in the loop
          </p>

          <div className="mx-auto mt-7 max-w-md px-3 text-center">
            <form className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(v) => setEmailAddress(v.target.value)}
                value={emailAddress}
                placeholder="Email address"
                className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 w-full rounded-full border py-3 px-4 focus:ring-accent dark:text-white dark:placeholder-white"
              />
              <button
                type="submit"
                onClick={handleSubmitEmail}
                className="hover:bg-accent-dark font-display absolute top-2 right-2 rounded-full bg-accent px-6 py-2 text-sm text-white"
              >
                Subscribe
              </button>
              {emailFeedback && (
                <p className="pt-6 text-center font-semibold">
                  {emailFeedback}
                </p>
              )}
            </form>
          </div>
        </section>
        <div className="mb-4 flex flex-col items-center justify-between p-2">
          <span className="dark:text-jacarta-400 text-center text-sm">
            <p>
              © 2022 Passes.{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-blue10"
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-blue10"
              >
                Terms of Service
              </a>{" "}
              - All rights reserved by <a href="">Passes.</a>
            </p>
          </span>
        </div>
      </div>
    </IntercomProvider>
  )
}

export default HomePage
