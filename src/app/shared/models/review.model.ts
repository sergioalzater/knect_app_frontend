export interface Review {
  id: number;
  reviewId?: number;
  businessId: number;
  businessName?: string;
  establishmentId?: number;
  establishmentName?: string;
  userId: number;
  userName?: string;
  rating: number;
  comment?: string;
  adminReply?: string;
  adminReplyAt?: string;
  createAt?: string;
  updateAt?: string;
}
