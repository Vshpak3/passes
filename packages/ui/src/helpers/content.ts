class Content {
  static profileImage(userId: string, profileId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/profile-${profileId}.jpg`
  }

  static profileBanner(userId: string, profileId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/profile/${userId}/banner-${profileId}.jpg`
  }

  static passImage(userId: string, passId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/pass/${userId}/${passId}.jpg`
  }

  static nftJson(collectionId: string, nftId: string): string {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/nft/${nftId}.json`
  }
}

export default Content
