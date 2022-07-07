import { ProfileEntity } from '../entities/profile.entity'

export class GetProfileDto {
  id: string
  userId: string
  fullName?: string
  isKYCVerified?: boolean
  description?: string
  profileImageUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
  youtubeUrl?: string
  discordUrl?: string
  twitchUrl?: string
  isActive: boolean

  constructor(profileEntity: ProfileEntity) {
    this.id = profileEntity.id
    this.userId = profileEntity.user.id
    this.description = profileEntity.description
    this.fullName = profileEntity.user.fullName
    this.isKYCVerified = profileEntity.user.isKYCVerified
    this.profileImageUrl = profileEntity.profileImageUrl
    this.instagramUrl = profileEntity.instagramUrl
    this.tiktokUrl = profileEntity.tiktokUrl
    this.youtubeUrl = profileEntity.youtubeUrl
    this.discordUrl = profileEntity.discordUrl
    this.twitchUrl = profileEntity.twitchUrl
    this.isActive = profileEntity.isActive
  }
}
