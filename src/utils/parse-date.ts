import { format } from "date-fns";

export const parseDate = (date: string) => {
  return format(new Date(date), "HH:mm,dd MMM yy");
};
