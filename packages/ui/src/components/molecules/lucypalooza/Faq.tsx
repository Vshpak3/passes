import classNames from "classnames"
import MinusIcon from "public/icons/minus-icon.svg"
import PlusIcon from "public/icons/plus-icon.svg"
import React, { useId, useState } from "react"

const Faq = () => {
  const faqs = [
    {
      question: "What is Lucypalooza?",
      answer: (
        <>
          <p className="mb-4">
            Come celebrate the launch of new web3 startup Passes and Lucy
            Guo&apos;s 28th birthday also known as ‘Lucypalooza’.
          </p>
          <p className="mb-4">
            Lucy Guo, tech mogul extraordinaire, co-founder of Scale AI ($7.4B
            valuation), top member of Forbes richest self-made women under 40
            —is turning 28 this October. With a strong passion for music and
            tech, Lucy is excited to celebrate her next chapter with the launch
            of her newest company, Passes. This event will take place in a
            private location in Los Angeles with incredible performances from
            world renowned DJs.
          </p>
        </>
      ),
      id: useId()
    },
    {
      question: "Why do I have to pay for LucyPalooza? ",
      answer: (
        <>
          <p className="mb-4">
            We are opening up only 18 tickets (3 VIP and 15 GA) to this
            extremely exclusive red carpet event with world renowned DJs,
            influencers, investors and tech founders all in one place. In
            addition to the invitation to this exclusive event, all guests will
            get access to an open bar, food & surprise performances from DJs
            that have played at world renowned festivals.
          </p>
          <p className="mb-4">
            Our VIP guests will also get special and expedited access to the
            event along with a table for 6 guests and bottle service with
            premium alcohol.
          </p>
        </>
      ),
      id: useId()
    },
    {
      question: "How can I pay for Lucypalooza?",
      answer: (
        <>
          <p className="mb-4">
            We’re accepting payments in USD through card payments. We are also
            accepting native ETH and USDC (ETH) as forms of crypto payment.
          </p>
          <p className="mb-4">
            For card payments, please enter all your card details and select it
            as your default before confirming the payment. Please make sure to
            contact your card issuer ahead of confirming the purchase to prevent
            a card decline.
          </p>
          <p className="mb-4">
            For crypto payments, you can connect your Metamask or Phantom
            wallets, select your preferred crypto currency and select that
            currency as default before confirming the payment.
          </p>
          <p className="mb-4">
            Please give payments a few minutes to process, especially crypto
            payments. The transactions can take up to a few minutes to be
            confirmed on the chain. DO NOT hit back or refresh buttons during
            payment processing.
          </p>
        </>
      ),
      id: useId()
    },
    {
      question: "What to expect after I pay for Lucypalooza?",
      answer: (
        <>
          <p className="mb-4">
            Once you successfully purchase a Lucypalooza pass, you will be added
            to the guest list along with your guests (for VIP pass purchase
            only).
          </p>
          <p className="mb-4">
            Additionally, a Lucypalooza pass (NFT) will be airdropped to a
            Passes generated custodial wallet and can be viewed by checking the
            Etherscan link available to you after pass purchase is successful.
          </p>
          <p className="mb-4">
            At the event space, you will be asked to verify your identity and
            provide proof of pass purchase before you are allowed in.
          </p>
        </>
      ),
      id: useId()
    },
    {
      question: "Why is the ETH price so much cheaper than USD?",
      answer: (
        <>
          <p className="mb-4">
            We want to support blockchain technology and believe the future is
            Web3. Hence, we&apos;ve decided to encourage everyone to pay in ETH
            by making the prices cheaper.
          </p>
        </>
      ),
      id: useId()
    }
  ]
  const [expandedQuestion, setExpandedQuestion] = useState(faqs[0].id)

  return (
    <section className="mt-[200px] px-4">
      <div className="mx-auto max-w-[747px]">
        <h3 className="text-center text-2xl font-bold leading-9">
          Frequently Asked Questions
        </h3>

        <ul className="mt-20 space-y-14">
          {faqs.map(({ question, answer, id }) => (
            <li key={id}>
              <button
                className={classNames(
                  "flex w-full items-center justify-between",
                  { "opacity-50": id !== expandedQuestion }
                )}
                onClick={() => setExpandedQuestion(id)}
              >
                <h5 className="text-md font-medium leading-8 md:text-[22px]">
                  {question}
                </h5>
                {id === expandedQuestion ? (
                  <MinusIcon className="mr-1.5" />
                ) : (
                  <PlusIcon />
                )}
              </button>
              {id === expandedQuestion && (
                <p className="mt-9 leading-[26px]">{answer}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Faq
