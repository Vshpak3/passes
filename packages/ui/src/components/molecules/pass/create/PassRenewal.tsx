import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { IconTooltip } from "src/components/atoms/IconTooltip"

export const PassRenewal = () => (
  <div>
    <hr className="border-passes-dark-200" />
    <div className="my-4 flex items-center gap-4">
      <IconTooltip
        Icon={InfoIcon}
        position="top"
        tooltipText="Renewal time can not be changed"
      />
      <span className="text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-semibold ">
        Automatically renews every 30 days
      </span>
    </div>
  </div>
)
