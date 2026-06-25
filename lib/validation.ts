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

const weight = z.coerce.number().int().min(0).max(100);

export const weightsSchema = z
  .object({
    C1: weight,
    C2: weight,
    C3: weight,
    C4: weight,
    C5: weight,
    C6: weight,
    C7: weight,
  })
  .refine((w) => w.C1 + w.C2 + w.C3 + w.C4 + w.C5 + w.C6 + w.C7 === 100, {
    message: "Total bobot harus tepat 100%",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CoffeeShopInput = z.infer<typeof coffeeShopSchema>;
