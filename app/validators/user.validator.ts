import vine from "@vinejs/vine";
import type { Infer } from "@vinejs/vine/types";

export type VUserCreate = Infer<typeof vUserCreate>;
export const vUserCreate = vine.object({
  name: vine.string(),
  email: vine.string().email(),
  password: vine.string(),
});