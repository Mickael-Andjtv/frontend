"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuItem } from "../types/menu.types";
import LabelComponent from "@/components/layout/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageUp, X } from "lucide-react";
import { ImageItem } from "@/types/image-items";

type Props = {
  triggerBtn?: React.ReactElement;
  initialData?: MenuItem | null;
  categories?: { id: string; name: string }[];
  onSubmit?: (
    data: Partial<MenuItem> & { imageFiles?: File[]; existingUrls?: string[] },
  ) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MenuFormSheet({
  triggerBtn,
  initialData,
  categories = [],
  onSubmit,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const setIsOpen = isControlled ? externalOnOpenChange : setInternalOpen;

  const isEditing = Boolean(initialData);

  const [images, setImages] = useState<ImageItem[]>(() =>
    initialData?.imageUrl
      ? initialData.imageUrl.map((url) => ({ id: url, url, isExisting: true }))
      : [],
  );

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price ? String(initialData.price) : "",
    preparationTimeMinutes: initialData?.preparationTimeMinutes
      ? String(initialData.preparationTimeMinutes)
      : "",
    categoryId: initialData?.categoryId || "",
    status:
      initialData?.status ||
      ("AVAILABLE" as "AVAILABLE" | "OUT_OF_STOCK" | "HIDDEN"),
    isVegetarian: initialData?.isVegetarian || false,
    isGlutenFree: initialData?.isGlutenFree || false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const newItems: ImageItem[] = filesArray.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImages((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const target = prev[indexToRemove];
      if (target && !target.isExisting) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFiles = images
      .filter((img) => !img.isExisting && img.file)
      .map((img) => img.file!);
    const existingUrls = images
      .filter((img) => img.isExisting)
      .map((img) => img.url);

    const payload = {
      ...initialData,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      preparationTimeMinutes: formData.preparationTimeMinutes
        ? parseInt(formData.preparationTimeMinutes, 10)
        : undefined,
      categoryId: formData.categoryId,
      status: formData.status,
      isVegetarian: formData.isVegetarian,
      isGlutenFree: formData.isGlutenFree,
      imageFiles: newFiles,
      existingUrls,
    };

    onSubmit?.(payload);
    setIsOpen?.(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {triggerBtn && <SheetTrigger render={triggerBtn} />}
      <SheetContent className="p-0 sm:max-w-md">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full max-h-screen"
        >
          <SheetHeader className="p-4 border-b shrink-0">
            <SheetTitle className="text-xl font-bold">
              {isEditing ? "Modifier le plat" : "Ajouter un plat"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {isEditing
                ? "Mettez à jour les informations du plat sélectionné."
                : "Renseignez toutes les informations requises pour ajouter un nouvel article."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="grid gap-2">
              <LabelComponent required htmfor="name" name="Nom du plat" />
              <Input
                id="name"
                placeholder="Ex: Burger Bacon Cheese"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <LabelComponent required htmfor="price" name="Prix (€)" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.50"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <LabelComponent
                  required={false}
                  htmfor="prepTime"
                  name="Préparation (min)"
                />
                <Input
                  id="prepTime"
                  type="number"
                  min="1"
                  placeholder="15"
                  value={formData.preparationTimeMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preparationTimeMinutes: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <LabelComponent required htmfor="category" name="Catégorie" />
              <Select
                value={formData.categoryId}
                onValueChange={(val) =>
                  val && setFormData({ ...formData, categoryId: val })
                }
              >
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {categories.map((cat) => (
                    <SelectItem
                      className="rounded-none"
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Plat Végétarien
                </span>
                <Switch
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isVegetarian: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Sans Gluten
                </span>
                <Switch
                  checked={formData.isGlutenFree}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isGlutenFree: checked })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <LabelComponent
                required={false}
                htmfor="description"
                name="Description"
              />
              <Textarea
                id="description"
                rows={3}
                placeholder="Ingrédients, allergènes..."
                className="rounded-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <LabelComponent required htmfor="status" name="Statut" />
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  val && setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="rounded-none w-full">
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="AVAILABLE">En stock</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Épuisé</SelectItem>
                  <SelectItem value="HIDDEN">Masqué</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid gap-3">
              <LabelComponent
                required={images.length === 0}
                htmfor="imageFiles"
                name="Images du plat"
              />

              <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-400 p-4 text-center transition-colors bg-slate-50/50 group cursor-pointer">
                <Input
                  id="imageFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                    <ImageUp size={20} className="text-gray-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Ajouter des images
                  </p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {images.map((img, index) => (
                    <div
                      key={`${img.id}-${index}`}
                      className="relative h-24 overflow-hidden border border-slate-200 group bg-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- preview uses blob/object URLs unsupported by next/image */}
                        <img
                        src={img.url}
                        alt={`Aperçu ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition-colors z-20"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="p-4 border-t shrink-0 flex gap-2">
            <Button type="submit" className="w-full">
              {isEditing ? "Enregistrer les modifications" : "Ajouter le plat"}
            </Button>
            <SheetClose
              render={
                <Button variant="outline" className="w-full">
                  Annuler
                </Button>
              }
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
