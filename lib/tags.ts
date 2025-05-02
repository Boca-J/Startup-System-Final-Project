export const TAG_OPTIONS = ["Work", "Personal", "Health", "Study", "Hobby"] as const;
export type TagOption = (typeof TAG_OPTIONS)[number];