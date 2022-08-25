function composeInitials(name) {
  return name
    .match(/(^\S\S?|\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase()
}

const MonogramIcon = ({ fullName }) => (
  <div className="align-items inline-block flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#a78df0] p-[10px]">
    <p className="table-cell text-center text-[18px] font-bold no-underline ">
      {composeInitials(fullName)}
    </p>
  </div>
)

export default MonogramIcon
