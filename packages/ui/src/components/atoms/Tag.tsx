import DeleteIcon from "public/icons/x.svg"

interface TagProps {
  title: string
  onClick: () => void
}

export const Tag: React.FC<TagProps> = ({ title, onClick }) => (
  <div className="flex flex-shrink-0 animate-fade-in-down items-center gap-[10px] rounded-[56px] border border-passes-dark-200 bg-[#100C11] py-[10px] px-[18px]">
    <span>{title}</span>
    <button type="button" onClick={onClick}>
      <DeleteIcon />
    </button>
  </div>
)
