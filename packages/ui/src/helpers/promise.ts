export const rejectIfAny = <T>(promises: PromiseSettledResult<T>[]) => {
  const rejected = promises.filter((result) => result.status === "rejected")

  if (rejected.length) {
    throw new Error("Failed promises")
  }
}
