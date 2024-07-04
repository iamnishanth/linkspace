import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (text: string, length: number) => {
  if (text.length > length) {
    return `${text.slice(0, length)}...`;
  }
  return text;
};

export const formatTimestamp = (seconds: number, nanoseconds: number) => {
  const timestamp = new Timestamp(seconds, nanoseconds);
  return timestamp.toDate().toDateString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (func: any, wait: number) => {
  let timeout: NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
