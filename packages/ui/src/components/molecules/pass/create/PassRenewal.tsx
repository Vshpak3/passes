import InfoIcon from "public/icons/post-info-circle-icon.svg"

import { IconTooltip } from "src/components/atoms/IconTooltip"

export const PassRenewal = () => (
  <div>
    <hr className="border-passes-dark-200" />
    <div className="my-4 flex items-center gap-4">
      <IconTooltip
        icon={InfoIcon}
        position="top"
        tooltipText="Renewal time can not be changed"
      />
      <span className="text-lg font-bold text-white/90 md:text-[15px] md:font-[500]">
        Automatically renews every month
      </span>
    </div>
  </div>
)
