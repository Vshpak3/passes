import React, { useEffect, useState } from "react"
import {
  CreatePassSection,
  SelectPassTypeSection
} from "src/components/organisms"
import { useCreatePass } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const CreatePass = () => {
  const [hasMounted, setHasMounted] = useState(false)
  const {
    register,
    files,
    isSubscriptionPass,
    onDragDropChange,
    errors,
    onRemove,
    onCreatePass,
    isLifetimePass,
    isSelectPassOption,
    maximumLimit
  } = useCreatePass()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  } else
    return isSelectPassOption ? (
      <SelectPassTypeSection />
    ) : (
      <CreatePassSection
        errors={errors}
        register={register}
        files={files}
        onDragDropChange={onDragDropChange}
        onRemove={onRemove}
        maximumLimit={maximumLimit}
        isLifetimePass={isLifetimePass}
        isSubscriptionPass={isSubscriptionPass}
        onCreatePass={onCreatePass}
      />
    )
}

export default withPageLayout(CreatePass, { header: true })
