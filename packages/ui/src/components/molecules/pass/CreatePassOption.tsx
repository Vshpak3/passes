import { FC, ReactElement } from "react"
import { PassesPinkButton } from "src/components/atoms/Button"
import { FormContainer } from "src/components/organisms/FormContainer"

interface CreatePassOptionProps {
  icon: ReactElement
  title: string
  subtitle: string
  onGetStarted: () => Promise<boolean>
  colStyle: string
}

export const CreatePassOption: FC<CreatePassOptionProps> = ({
  icon,
  title,
  subtitle,
  onGetStarted,
  colStyle
}) => {
  return (
    <div className={`col-span-12 space-y-6 ${colStyle} lg:max-w-[280px]`}>
      <FormContainer>
        <div className="mx-auto py-3">{icon}</div>
        <span className="mt-3 text-center text-[18px] font-bold text-white/90">
          {title}
        </span>
        <span className="text-center text-[14px] text-white/70">
          {subtitle}
        </span>
        <div className="mt-auto">
          <PassesPinkButton name="Get Started" onClick={onGetStarted} />
        </div>
      </FormContainer>
    </div>
  )
}
