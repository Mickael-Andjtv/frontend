import { apiGet } from "./http";

export type CategoryOption = { id: string; name: string };

interface CategoryDto {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export async function getCategories(): Promise<CategoryOption[]> {
  const categories = await apiGet<CategoryDto[]>("/api/categories");
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}