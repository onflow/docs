import { User } from "../../interfaces"
import { TutorialCardIconType, TUTORIAL_CARD_ICONS } from "./icons"

export type TutorialCardPropsImageUri = {
  author?: User
  className?: string
  description: string
  heading: string
  imageUri?: string
  lastUpdated?: string
  level?: string
  link: string
  tags: string[]
}

export type TutorialCardPropsImagePreset = TutorialCardPropsImageUri & {
  imageUri: never
  imageType: TutorialCardIconType
}

export type TutorialCardProps =
  | TutorialCardPropsImagePreset
  | TutorialCardPropsImageUri


