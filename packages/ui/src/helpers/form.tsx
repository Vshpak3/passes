import { FieldValues, FormState } from "react-hook-form"

export function dirtyValues<T extends FieldValues>(
  dirtyFields: FormState<T>["dirtyFields"],
  allValues: T
): T {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.fromEntries(
    Object.keys(dirtyFields).map((f) => [f, allValues[f as keyof T]])
  )
}
