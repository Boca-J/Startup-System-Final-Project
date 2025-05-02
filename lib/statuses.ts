export const STATUS_OPTIONS = ["public", "private"] as const;
export type StatusOption = (typeof STATUS_OPTIONS)[number];