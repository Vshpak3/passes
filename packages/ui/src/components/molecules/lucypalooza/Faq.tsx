import classNames from "classnames"
import MinusIcon from "public/icons/minus-icon.svg"
import PlusIcon from "public/icons/plus-icon.svg"
import React, { useId, useState } from "react"

const Faq = () => {
  const faqs = [
    {
      question: "What does it do?",
      answer: "Passes is an exclusive membership club for your superfans. ",
      id: useId()
    },
    {
      question: "Why build my community with Passes?",
      answer: "Passes is an exclusive membership club for your superfans. ",
      id: useId()
    },
    {
      question: "What makes it different?",
      answer: "Passes is an exclusive membership club for your superfans. ",
      id: useId()
    },
    {
      question: "How do I make money?",
      answer: "Passes is an exclusive membership club for your superfans. ",
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
                <h5 className="text-[22px] font-medium leading-8">
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
