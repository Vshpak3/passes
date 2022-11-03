import * as snippet from "@segment/snippet"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SegmentConfig = snippet.min({
  apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
})
