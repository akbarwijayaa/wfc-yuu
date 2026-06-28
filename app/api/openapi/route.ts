import { openapiDocument } from "@/lib/openapi";

export function GET() {
  return Response.json(openapiDocument);
}
