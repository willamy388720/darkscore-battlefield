import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGameDuration = (
  createdAt: string | Date,
  finishedAt: string | Date
): string => {
  if (typeof createdAt !== "string" || typeof finishedAt !== "string")
    return "00:00:00";

  const start = new Date(createdAt).getTime();
  const end = new Date(finishedAt).getTime();
  const durationMs = end - start;

  if (durationMs < 0) return "00:00:00"; // Caso as datas estejam incorretas

  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
    seconds
  )}`;
};
