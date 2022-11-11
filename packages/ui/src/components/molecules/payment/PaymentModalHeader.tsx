import { UserDisplayInfoDto } from "@passes/api-client"
import { FC } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"

interface PaymenetModalHeaderProps {
  title: string
  user?: UserDisplayInfoDto
}

export const PaymenetModalHeader: FC<PaymenetModalHeaderProps> = ({
  title,
  user
}) => {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      {!!user && (
        <div className="mb-4 flex items-center border-b border-passes-gray-600 pt-2 pb-6">
          <ProfileWidget linked={false} user={user} />
        </div>
      )}
    </>
  )
}
