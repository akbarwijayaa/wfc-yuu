import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const criteria = [
  { code: "C1", name: "Kecepatan WiFi", description: "Kecepatan internet WiFi (Mbps)", defaultWeight: 20, type: "benefit" },
  { code: "C2", name: "Ketersediaan Stop Kontak", description: "Jumlah titik stop kontak", defaultWeight: 10, type: "benefit" },
  { code: "C3", name: "Harga Rata-rata", description: "Harga rata-rata minuman kopi (Rp)", defaultWeight: 15, type: "cost" },
  { code: "C4", name: "Jam Operasional", description: "Durasi jam buka per hari", defaultWeight: 10, type: "benefit" },
  { code: "C5", name: "Tingkat Kebisingan", description: "Tingkat kebisingan suasana", defaultWeight: 15, type: "cost" },
  { code: "C6", name: "Kenyamanan Tempat Duduk", description: "Kenyamanan tempat duduk & ruang", defaultWeight: 15, type: "benefit" },
  { code: "C7", name: "Lokasi/Akses", description: "Kemudahan akses ke lokasi", defaultWeight: 15, type: "benefit" },
];

const shops = [
  { name: "Filosofi Kopi Jogja", region: "Kota Yogyakarta", address: "Jl. Pajeksan, Yogyakarta", wifiSpeed: 25, powerOutlets: 8, avgPrice: 20000, operatingHours: 15, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Mudah" },
  { name: "Kopi Klotok", region: "Sleman", address: "Jl. Kaliurang KM 16, Sleman", wifiSpeed: 10, powerOutlets: 6, avgPrice: 15000, operatingHours: 11, noiseLevel: "Sedang", comfort: "Cukup", locationAccess: "Sedang" },
  { name: "Cethe Coffee", region: "Sleman", address: "Jl. Seturan Raya, Sleman", wifiSpeed: 30, powerOutlets: 10, avgPrice: 22000, operatingHours: 14, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Mudah" },
  { name: "Kedai Kopi Nol Derajat", region: "Kota Yogyakarta", address: "Jl. Cendana, Yogyakarta", wifiSpeed: 20, powerOutlets: 7, avgPrice: 18000, operatingHours: 12, noiseLevel: "Sedang", comfort: "Nyaman", locationAccess: "Mudah" },
  { name: "Kopi Joss Lik Man", region: "Kota Yogyakarta", address: "Jl. Wongsodirjan (Stasiun Tugu), Yogyakarta", wifiSpeed: 5, powerOutlets: 3, avgPrice: 8000, operatingHours: 8, noiseLevel: "Tinggi", comfort: "Kurang", locationAccess: "Mudah" },
  { name: "Epic Coffee", region: "Sleman", address: "Jl. Seturan, Sleman", wifiSpeed: 35, powerOutlets: 9, avgPrice: 25000, operatingHours: 16, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Mudah" },
  { name: "Awor Gallery & Coffee", region: "Kota Yogyakarta", address: "Jl. Suryodiningratan, Yogyakarta", wifiSpeed: 22, powerOutlets: 8, avgPrice: 28000, operatingHours: 14, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Sedang" },
  { name: "Kopi Soe Jogja", region: "Kota Yogyakarta", address: "Jl. Gejayan, Yogyakarta", wifiSpeed: 15, powerOutlets: 6, avgPrice: 16000, operatingHours: 13, noiseLevel: "Sedang", comfort: "Cukup", locationAccess: "Mudah" },
  { name: "Titik Temu Coffee", region: "Bantul", address: "Jl. Parangtritis KM 6, Bantul", wifiSpeed: 28, powerOutlets: 9, avgPrice: 23000, operatingHours: 15, noiseLevel: "Rendah", comfort: "Nyaman", locationAccess: "Sedang" },
  { name: "Janji Jiwa Jogja", region: "Sleman", address: "Jl. Affandi, Sleman", wifiSpeed: 12, powerOutlets: 5, avgPrice: 14000, operatingHours: 13, noiseLevel: "Tinggi", comfort: "Cukup", locationAccess: "Mudah" },
];

async function main() {
  // Reset (idempotent re-seed)
  await prisma.recommendationDetail.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.coffeeShop.deleteMany();
  await prisma.criterion.deleteMany();
  await prisma.user.deleteMany();

  for (const c of criteria) await prisma.criterion.create({ data: c });
  for (const s of shops) await prisma.coffeeShop.create({ data: s });

  await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@spk.test",
      username: "admin",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
    },
  });
  await prisma.user.create({
    data: {
      name: "Pengunjung Demo",
      email: "user@spk.test",
      username: "user",
      password: bcrypt.hashSync("user123", 10),
      role: "visitor",
    },
  });

  const shopCount = await prisma.coffeeShop.count();
  const critCount = await prisma.criterion.count();
  console.log(`Seeded: ${shopCount} coffee shops, ${critCount} criteria, 2 users.`);
  console.log("  admin login → admin / admin123");
  console.log("  visitor login → user / user123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
