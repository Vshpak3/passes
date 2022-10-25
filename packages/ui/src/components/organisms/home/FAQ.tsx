import { Disclosure, Transition } from "@headlessui/react"
import classNames from "classnames"
import React from "react"
import { ChevronDown } from "src/icons/ChevronDown"

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "What does it do?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
  },
  {
    question: "Why build my community with Passes?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
  },
  {
    question: "What makes it different?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
  }
]

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FAQ = () => {
  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      <h3 className="text-center text-4xl font-bold">
        Frequently Asked Questions
      </h3>
      <div className="mx-auto max-w-7xl px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl divide-y-2">
          <dl className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="flex w-full items-start justify-between text-left">
                        <span className="font-medium">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          <ChevronDown
                            className={classNames(
                              open ? "-rotate-180" : "rotate-0",
                              "h-6 w-6 transform"
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel
                        as="dd"
                        className="bg-[hsla(0, 0%, 100%, 0.05)] mt-2 py-2 pr-12"
                      >
                        <p className="text-base text-gray-500">{faq.answer}</p>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
