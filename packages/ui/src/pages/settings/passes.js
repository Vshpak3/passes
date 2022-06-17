const Passes = () => {
  return (
    <div className="m-6 flex w-5/6 flex-col border p-6">
      <h1 className="mb-4 text-lg font-bold">Mint a new Pass</h1>
      <label className="my-2">Name this collection</label>
      <input placeholder="Pass Name" className="border p-1" />

      <div className="my-6 border" />

      <label className="my-2">How many passes are for sale?</label>
      <div className="flex">
        <input type="checkbox" /> <span>Unlimited</span>
      </div>
      <div className="flex">
        <input type="checkbox" /> <span>Fixed number</span>
      </div>
      <input
        placeholder="If fixed number, how many to mint?"
        className="border p-1"
      />

      <div className="my-6 border" />

      <label className="my-2">What art do you want for this collection?</label>
      <input
        placeholder="Upload the art for this pass"
        className="border p-1"
      />

      <div className="my-6 border" />

      <label className="my-2">
        What features do you want this pass to unlock?
      </label>
      <div className="flex">
        <input type="checkbox" /> <span>All paywall content</span>
      </div>
      <div className="flex">
        <input type="checkbox" />{" "}
        <span>All paywall content labeled &quot;passCollectionName&quot;</span>
      </div>
      <div className="flex">
        <input type="checkbox" /> <span>Unlimited free DMs per month</span>
      </div>
      <div className="flex">
        <input type="checkbox" /> <span># free DMs per month</span>
      </div>

      <div className="my-6 border" />

      <label className="my-2">How much does this cost per month?</label>
      <input placeholder="Monthly cost ($)" className="border p-1" />
    </div>
  )
}

export default Passes
