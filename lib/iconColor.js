import { Users, Gavel, Heart, Shield, Zap, Building2 } from "lucide-react";

export const getIconByAbbr = (abbr) => {
  const normalized = abbr?.toUpperCase() || "";
  if (normalized.includes("BPD")) return Gavel;
  if (normalized.includes("LPM")) return Users;
  if (normalized.includes("PKK")) return Heart;
  if (normalized.includes("KT")) return Zap; // Karang Taruna
  if (normalized.includes("LINMAS")) return Shield;
  return Building2; // Default Icon
};

export const getColorStyles = (color) => {
  const colors = {
    blue: {
      bg: "bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    orange: {
      bg: "bg-orange-500",
      light: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    pink: {
      bg: "bg-pink-500",
      light: "bg-pink-50",
      text: "text-pink-600",
      border: "border-pink-200",
    },
    indigo: {
      bg: "bg-indigo-600",
      light: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-200",
    },
    green: {
      bg: "bg-emerald-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    red: {
      bg: "bg-red-600",
      light: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    },
  };
  return colors[color] || colors.blue; // Default biru
};
