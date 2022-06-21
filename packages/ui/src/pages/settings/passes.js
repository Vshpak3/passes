import { useState } from "react"
import { range } from "lodash"
const Passes = () => {
  const [tiers, setTiers] = useState(3)
  return (
    <div className="m-6 flex w-5/6 flex-col border p-6">
      <h1 className="mb-4 text-lg font-bold text-fuchsia-500">
        Mint a new Pass
      </h1>
      <label className="my-2">Name this collection</label>
      <input placeholder="Collection Name" className="border p-1" />

      <div className="my-6 border" />

      <label className="my-2">How many to sell?</label>
      <input placeholder="Mint #" className="border p-1" />

      <label className="my-2">How many Tiers?</label>
      <input
        placeholder="Mint #"
        className="border p-1"
        value={tiers}
        onChange={(e) => setTiers(e.target.value)}
      />
      {range(0, tiers).map((number) => {
        return (
          <div className="collapse" key={number}>
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              <h3>Tier {number + 1}</h3>
            </div>
            <div className="collapse-content flex flex-col">
              <label className="my-2">Subtitle for this tier</label>
              <input placeholder="Mint #" className="border p-1" />
              <label className="my-2">Art</label>
              <input placeholder="Upload" className="border p-1" />
              <label className="my-2">Add text to your pass</label>
              <input
                placeholder="Talk dirty to me bb ;)"
                className="border p-1"
              />
              <label className="my-2">What does this tier pass unlock?</label>
              <h4>Content</h4>
              <div className="flex">
                <input type="checkbox" />{" "}
                <span>All (media, stories, livestream)</span>
              </div>
              <div className="flex">
                <input type="checkbox" />{" "}
                <span>Only content tagged thisCollectionTier</span>
              </div>
              <h4>Direct Messages</h4>
              <div className="flex">
                <input type="checkbox" />{" "}
                <span>Unlimited messages per month</span>
              </div>
              <div className="flex">
                <input type="checkbox" /> <span>Capped per month</span>
              </div>
              <label className="my-2">
                How much does a pass in this tier cost?
              </label>
              <input placeholder="$" className="border p-1" />

              <div className="flex">
                <input type="checkbox" />{" "}
                <span>Want to whitelist a specific NFT community</span>
              </div>
              <div className="flex">
                <input type="checkbox" />{" "}
                <span>
                  Want to include merchandise, events or other in real life. We
                  will reach out :)
                </span>
              </div>
            </div>
          </div>
        )
      })}

      <div className="my-6 border" />

      <button
        className="btn btn-ghost gap-2"
        onClick={() => setTiers(tiers + 1)}
      >
        + Add another tier?
      </button>
    </div>
  )
}

export default Passes
