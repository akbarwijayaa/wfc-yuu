/**
 * One-off migration: shift ALL stored timestamps by +7 hours so the raw values
 * in the database read as WIB (UTC+7) wall-clock instead of UTC.
 *
 *   bun scripts/shift-db-to-wib.ts            # dry-run (shows before -> after)
 *   bun scripts/shift-db-to-wib.ts --apply    # actually writes
 *
 * ⚠️ Only run this if you want the DB to STORE local (WIB) time. If you keep the
 * default "store UTC + display WIB" setup (lib/datetime.ts formatWIB), DO NOT run
 * this — it would make the UI show +14h. Uses raw SQL so @updatedAt is not bumped.
 */
import { prisma } from "../lib/db";

const APPLY = process.argv.includes("--apply");
const REVERT = process.argv.includes("--revert"); // subtract 7h (undo a previous --apply)
const SIGN = REVERT ? -1 : 1;
const OP = REVERT ? "-" : "+";
const fmt = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "short", timeStyle: "medium" });

async function main() {
  const sample = await prisma.recommendation.findMany({ take: 3, orderBy: { id: "asc" } });
  const counts = {
    User: await prisma.user.count(),
    CoffeeShop: await prisma.coffeeShop.count(),
    Preference: await prisma.preference.count(),
    Recommendation: await prisma.recommendation.count(),
  };

  console.log(`Mode: ${APPLY ? `APPLY (${OP}7h)` : "DRY-RUN"}${REVERT ? " [revert]" : ""}`);
  console.log("Rows affected:", counts);
  console.log(`Sample Recommendation.createdAt (current stored -> ${OP}7h):`);
  for (const r of sample) {
    const now = r.createdAt;
    const shifted = new Date(now.getTime() + SIGN * 7 * 3600 * 1000);
    console.log(`  #${r.id}: ${now.toISOString()}  ->  ${shifted.toISOString()}  (WIB view of result: ${fmt.format(shifted)})`);
  }

  if (!APPLY) {
    console.log("\nDry-run only. Re-run with --apply (add --revert to subtract).");
    return;
  }

  const INTERVAL = `${OP} interval '7 hours'`;
  await prisma.$transaction([
    prisma.$executeRawUnsafe(`UPDATE "User" SET "createdAt" = "createdAt" ${INTERVAL}`),
    prisma.$executeRawUnsafe(`UPDATE "CoffeeShop" SET "createdAt" = "createdAt" ${INTERVAL}, "updatedAt" = "updatedAt" ${INTERVAL}`),
    prisma.$executeRawUnsafe(`UPDATE "Preference" SET "createdAt" = "createdAt" ${INTERVAL}`),
    prisma.$executeRawUnsafe(`UPDATE "Recommendation" SET "createdAt" = "createdAt" ${INTERVAL}`),
  ]);
  console.log(`\n✓ Shifted all timestamps by ${OP}7 hours.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
