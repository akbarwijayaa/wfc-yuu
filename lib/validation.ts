import { z } from "zod";

export const ROLES = ["admin", "visitor"] as const;
export const NOISE_LEVELS = ["Rendah", "Sedang", "Tinggi"] as const;
export const COMFORT_LEVELS = ["Kurang", "Cukup", "Nyaman"] as const;
export const ACCESS_LEVELS = ["Sulit", "Sedang", "Mudah"] as const;

export const noiseEnum = z.enum(NOISE_LEVELS);
export const comfortEnum = z.enum(COMFORT_LEVELS);
export const accessEnum = z.enum(ACCESS_LEVELS);

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const coffeeShopSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  address: z.string().optional().or(z.literal("")),
  region: z.string().optional().or(z.literal("")),
  wifiSpeed: z.coerce.number().int().min(0),
  powerOutlets: z.coerce.number().int().min(0),
  avgPrice: z.coerce.number().int().min(0),
  operatingHours: z.coerce.number().int().min(0).max(24),
  noiseLevel: noiseEnum,
  comfort: comfortEnum,
  locationAccess: accessEnum,
  description: z.string().optional().or(z.literal("")),
  photoUrl: z.string().optional().or(z.literal("")),
});

const CODES = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"] as const;

export const weightsSchema = z
  .object(Object.fromEntries(CODES.map((c) => [c, z.coerce.number().int().min(0).max(100)])) as Record<
    (typeof CODES)[number],
    z.ZodType<number>
  >)
  .refine(
    (w) => CODES.reduce((sum, c) => sum + (w[c] ?? 0), 0) === 100,
    { message: "Total bobot harus tepat 100%" }
  );

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CoffeeShopInput = z.infer<typeof coffeeShopSchema>;
