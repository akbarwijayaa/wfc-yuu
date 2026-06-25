// Dev-only helper: mint session JWTs for smoke testing guarded routes.
import { signToken } from "../lib/jwt";

const admin = await signToken({ sub: "1", username: "admin", role: "admin", name: "Administrator" });
const visitor = await signToken({ sub: "2", username: "user", role: "visitor", name: "Pengunjung Demo" });

console.log(`ADMIN=${admin}`);
console.log(`VISITOR=${visitor}`);
