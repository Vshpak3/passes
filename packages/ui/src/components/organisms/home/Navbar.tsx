// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState } from "react"

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="mx-auto max-w-7xl py-2.5 px-4">
        <div className="mx-auto flex w-full items-center justify-between">
          <a className="flex items-center">
            <span className="self-center whitespace-nowrap text-2xl font-bold text-white">
              Passes
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 md:hidden"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="md:text-md mt-4 flex flex-col items-center rounded-lg border p-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:font-semibold">
              <li>
                <a
                  href="#features"
                  className="block rounded py-2 pr-4 pl-3 text-gray-400 hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="block rounded py-2 pr-4 pl-3 text-gray-400 hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent md:dark:hover:text-white"
                >
                  Sign In
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="block rounded-full bg-white px-4 py-2 text-black"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="absolute w-full bg-black md:hidden" id="navbar-default">
          <ul className="mt-4 flex flex-col space-y-6 rounded-lg p-4 py-8 font-semibold">
            <li>
              <a href="#features" className="text-white">
                Features
              </a>
            </li>
            <li>
              <a href="/login" className="text-white">
                Sign In
              </a>
            </li>
            <li className="rounded-full bg-white p-4 text-center">
              <a href="/signup" className="mx-auto w-full text-black">
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
