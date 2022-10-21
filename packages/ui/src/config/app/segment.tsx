import * as snippet from "@segment/snippet"

export const SegmentConfig = snippet.min({
  apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
})
