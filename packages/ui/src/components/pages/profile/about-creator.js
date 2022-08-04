import PropTypes from "prop-types"
import { ProfileNFtPass } from "src/components/organisms"

const AboutCreator = ({ mockCreator }) => {
  return (
    <>
      <div
        className="ml-12 p-5 px-5 sm:ml-28 md:p-10 md:px-20"
        style={{
          borderRight: "1px solid #3b3b3b"
        }}
      >
        <h2
          className="mb-4 text-white"
          style={{
            fontWeight: "bolder"
          }}
        >
          Who is Andrea Botez
        </h2>
        <h2 className="text-gray-400  dark:text-mauveDark-mauve12">
          Welcome to my Moment, a casual page for fans who want to get to know
          me better. I share stream & other content updates, candid photos of
          myself or my travels, and random daily thoughts. Thank you for
          supporting me 💞
        </h2>
        <h2
          className="mt-10 mb-4"
          style={{
            fontWeight: "bolder"
          }}
        >
          Overview of Passes
        </h2>
        <p className="text-gray-400 ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
      </div>
      <div className="hidden border-t-0 pt-10 pl-16 pr-20 xl:block">
        {mockCreator.nftPasses &&
          mockCreator.nftPasses.map((nftPass, index) => (
            <ProfileNFtPass key={index} nftPass={nftPass} />
          ))}
      </div>
    </>
  )
}

AboutCreator.propTypes = {
  mockCreator: PropTypes.object
}

export default AboutCreator
