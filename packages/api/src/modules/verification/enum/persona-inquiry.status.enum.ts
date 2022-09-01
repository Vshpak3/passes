export enum PersonaInquiryStatusEnum {
  CREATED = 'created',
  PENDING = 'pending',
  // currently only state that should hit the backend
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  NEEDS_REVIEW = 'needs_review',
  APPROVED = 'approved',
  DECLINED = 'declined',
}
