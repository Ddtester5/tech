import { PartialPhoneModel } from "@/entities/phone_models";
import { Reviews, Tag } from "@prisma/client";

export type PartialReviews = Pick<
  Reviews,
  "id" | "createdAt" | "previewImage" | "slug" | "views" | "title" | "meta_description"
>;

export type PartialReviewsWithTags = PartialReviews & {
  tags: Pick<Tag, "slug" | "title">[];
};

export type ReviewFullInfo = Reviews & { phoneModel: PartialPhoneModel | null };
export type PartialReviewsBySitemap = Pick<Reviews, "createdAt" | "slug" | "updatedAt">;
