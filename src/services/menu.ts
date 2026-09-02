import { apiDelete, apiGet, apiPatch, apiPost, apiPut, apiPostFormData, resolveApiUrl } from "./http";
import type { MenuOption, MenuItem, ItemStatus } from "@/features/menu/types/menu.types";

export type { CategoryOption } from "./categories";

interface MenuItemDto {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string[];
  status: ItemStatus;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  preparationTimeMinutes: number | null;
  optionGroups: {
    id: string;
    name: string;
    required: boolean;
    minChoices: number | null;
    maxChoices: number | null;
    options: { id: string; name: string; priceExtra: number }[];
  }[] | null;
  createdAt: string;
  updatedAt: string;
}

function mapMenuItem(dto: MenuItemDto): MenuItem {
  return {
    id: dto.id,
    categoryId: dto.categoryId,
    name: dto.name,
    description: dto.description ?? undefined,
    price: dto.price,
    imageUrl: (dto.imageUrl ?? []).map(resolveApiUrl),
    status: dto.status,
    isVegetarian: dto.isVegetarian,
    isGlutenFree: dto.isGlutenFree,
    preparationTimeMinutes: dto.preparationTimeMinutes ?? undefined,
    optionGroups: (dto.optionGroups ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      required: group.required,
      minChoices: group.minChoices ?? undefined,
      maxChoices: group.maxChoices ?? undefined,
      options: (group.options ?? []).map((option) => ({
        id: option.id,
        name: option.name,
        priceExtra: option.priceExtra,
      })) as MenuOption[],
    })),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export type MenuItemPayload = Partial<MenuItem> & {
  imageFiles?: File[];
  existingUrls?: string[];
};

export async function getMenuItems(): Promise<MenuItem[]> {
  const items = await apiGet<MenuItemDto[]>("/api/menu-items");
  return items.map(mapMenuItem);
}

export async function createMenuItem(payload: MenuItemPayload): Promise<MenuItem> {
  const imageUrl = await resolveImageUrl(payload);
  const dto = await apiPost<MenuItemDto>("/api/menu-items", {
    categoryId: payload.categoryId,
    name: payload.name,
    description: payload.description || null,
    price: payload.price,
    imageUrl,
    status: payload.status ?? "AVAILABLE",
    isVegetarian: payload.isVegetarian ?? false,
    isGlutenFree: payload.isGlutenFree ?? false,
    preparationTimeMinutes: payload.preparationTimeMinutes ?? null,
  });
  return mapMenuItem(dto);
}

export async function updateMenuItem(id: string, payload: MenuItemPayload): Promise<MenuItem> {
  const imageUrl = await resolveImageUrl(payload);
  const dto = await apiPut<MenuItemDto>(`/api/menu-items/${id}`, {
    categoryId: payload.categoryId,
    name: payload.name,
    description: payload.description || null,
    price: payload.price,
    imageUrl,
    status: payload.status,
    isVegetarian: payload.isVegetarian,
    isGlutenFree: payload.isGlutenFree,
    preparationTimeMinutes: payload.preparationTimeMinutes ?? null,
  });
  return mapMenuItem(dto);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiDelete<{ message: string }>(`/api/menu-items/${id}`);
}

export async function updateMenuItemStatus(id: string, isAvailable: boolean): Promise<void> {
  const status: ItemStatus = isAvailable ? "AVAILABLE" : "OUT_OF_STOCK";
  await apiPatch<MenuItemDto>(`/api/menu-items/${id}/status?status=${status}`, {});
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await apiPostFormData<{ url: string }>("/api/uploads/menu-image", formData);
  return resolveApiUrl(result.url);
}

async function resolveImageUrl(payload: MenuItemPayload): Promise<string[]> {
  // Use only the explicitly preserved existing URLs plus newly uploaded files.
  // Do NOT merge payload.imageUrl, which can carry the full pre-edit list and
  // cause duplication when editing (existingUrls already reflects kept images).
  const existing = payload.existingUrls ?? [];
  if (!existing.length && payload.imageUrl?.length) {
    existing.push(...payload.imageUrl);
  }
  const uploaded = await Promise.all((payload.imageFiles ?? []).map(uploadImage));
  return [...existing.map(resolveApiUrl), ...uploaded];
}