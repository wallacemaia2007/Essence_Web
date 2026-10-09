export const storeHours = {
  summary: "Seg a sex, 9h às 18h",
  openWeekdays: [1, 2, 3, 4, 5] as const,
  openingHoursSchema: ["Mo-Fr 09:00-18:00"] as const,
} as const;

// TODO: confirmar com a loja se há atendimento aos sábados antes de liberar datas nesse dia.
export function isStoreOpenOnWeekday(weekday: number) {
  return (storeHours.openWeekdays as readonly number[]).includes(weekday);
}
