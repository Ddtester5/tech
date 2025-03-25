"use server";
import { dataBase } from "@/shared/lib/db_conect";
import { TagsWithCounts } from "../_domain/types";

export const getAllTagsWithPagination = async (pageParam: number, perPage: number): Promise<TagsWithCounts[] | []> => {
  try {
    const tags = await dataBase.tag.findMany({
      orderBy: {
        title: "asc",
      },
      include: {
        _count: { select: { news: true, reviews: true } },
      },
      skip: (pageParam - 1) * perPage,
      take: perPage,
    });

    return tags;
  } catch (error) {
    console.error("Ошибка при получении tags:", error);
    return [];
  }
};
