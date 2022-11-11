import { TagDto } from "@passes/api-client"
import { array, bool, string } from "yup"

import { MAX_MENTION_LIMIT } from "src/config/post"
import { ContentFile } from "src/hooks/useMedia"

export const yupPaid = (
  text: string,
  maxLength: number,
  min: number,
  max: number,
  emptyMessage: string
) => {
  return {
    text: string()
      .optional()
      .max(
        maxLength,
        `The ${text} cannot be longer than ${maxLength} characters`
      )
      .transform((_text) => _text.trim())
      .when("files", {
        is: (f: ContentFile[]) => f.length === 0,
        then: string().required(emptyMessage)
      }),
    files: array<ContentFile>().when("isPaid", {
      is: true,
      then: array().min(
        1,
        `You cannot create a paid ${text} without media content`
      )
    }),
    isPaid: bool().optional(),
    price: string()
      .optional()
      .when("isPaid", {
        is: true,
        then: string()
          .required("A price must be set for a paid post")
          .test(
            "is-currency",
            "Please enter a valid currency amount",
            (value) =>
              !!(value || "").match(
                // eslint-disable-next-line regexp/no-unused-capturing-group
                /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/
              )
          )
          .test(
            "min",
            `The minimum price of a ${text} is $${min}`,
            (value) => parseFloat(value || "") >= min
          )
          .test(
            "max",
            `The maximum price of a ${text} is $${max}`,
            (value) => parseFloat(value || "") <= max
          )
      })
  }
}

export const yupTags = (type: string) => {
  return {
    tags: array<TagDto>()
      .optional()
      .max(
        MAX_MENTION_LIMIT,
        `You cannot tag more than ${MAX_MENTION_LIMIT} users in a ${type}`
      )
  }
}

export const yupPostText = (maxLength: number, type: string) => {
  return {
    text: string()
      .required()
      .max(
        maxLength,
        `The ${type} cannot be longer than ${maxLength} characters`
      )
      .transform((text) => text.trim())
  }
}
