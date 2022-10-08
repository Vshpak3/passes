import { CircleCardDto, PayinMethodDto, PostDto } from "@passes/api-client"

export interface PostPaymentProps {
  cards: CircleCardDto[]
  defaultPayinMethod: PayinMethodDto | undefined
  post: PostDto
  setIsPayed?: (value: boolean) => void
}
