"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MenuItem } from "../types/menu.types";
import { formatAr } from "@/lib/money";

type BaseMenuCardProps = {
  menuItem: MenuItem;
  headerBadges?: React.ReactNode;
  footerActions: React.ReactNode;
  imageClassName?: string;
  autoPlayInterval?: number;
};

export const BaseMenuCard = ({
  menuItem,
  headerBadges,
  footerActions,
  imageClassName = "",
  autoPlayInterval = 3500,
}: BaseMenuCardProps) => {
  const images =
    Array.isArray(menuItem.imageUrl) && menuItem.imageUrl.length > 0
      ? menuItem.imageUrl
      : ["/placeholder-food.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  return (
    <Card className="overflow-hidden pt-0 flex flex-col justify-between h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <CardHeader className="p-0 rounded-none relative h-48 w-full overflow-hidden bg-slate-100 group">
          {/* Images avec transition en fondu style écran publicitaire */}
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- backend http images unsupported by next/image optimizer
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${menuItem.name} - Vue ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              } ${imageClassName}`}
            />
          ))}

          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-start pointer-events-none">
            {headerBadges}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Aller à l'image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-slate-900 line-clamp-1">
              {menuItem.name}
            </h3>
            <span className="font-bold text-gray-900 text-base shrink-0">
              {formatAr(menuItem.price)}
            </span>
          </div>

          {menuItem.description && (
            <p className="text-xs text-slate-500 line-clamp-2">
              {menuItem.description}
            </p>
          )}

          {menuItem.preparationTimeMinutes && (
            <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-1">
              <Clock className="w-3 h-3" />
              <span>{menuItem.preparationTimeMinutes} min</span>
            </div>
          )}
        </CardContent>
      </div>

      {footerActions}
    </Card>
  );
};
