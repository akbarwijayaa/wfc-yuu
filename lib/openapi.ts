// OpenAPI 3.1 document describing the SPK Coffee Shop REST API.
// Served at /api/openapi and rendered by Scalar at /docs.

const noiseEnum = ["Rendah", "Sedang", "Tinggi"];
const comfortEnum = ["Kurang", "Cukup", "Nyaman"];
const accessEnum = ["Sulit", "Sedang", "Mudah"];
const criteriaCodes = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"];

export const openapiDocument = {
  openapi: "3.1.0",
  info: {
    title: "SPK Coffee Shop API (MFEP)",
    version: "1.0.0",
    description:
      "REST API untuk Sistem Penunjang Keputusan pemilihan coffee shop di Yogyakarta dengan metode MFEP (Multi-Factor Evaluation Process).",
  },
  servers: [{ url: "/", description: "This deployment" }],
  tags: [
    { name: "Coffee Shops", description: "Data alternatif coffee shop" },
    { name: "Criteria", description: "Kriteria evaluasi MFEP" },
    { name: "Recommendations", description: "Perangkingan MFEP" },
  ],
  paths: {
    "/api/coffee-shops": {
      get: {
        tags: ["Coffee Shops"],
        summary: "Daftar semua coffee shop",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/CoffeeShop" } },
              },
            },
          },
        },
      },
    },
    "/api/coffee-shops/{id}": {
      get: {
        tags: ["Coffee Shops"],
        summary: "Detail coffee shop beserta skor evaluasi (E) per kriteria",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 6 },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CoffeeShopDetail" } },
            },
          },
          "404": { description: "Coffee shop tidak ditemukan" },
        },
      },
    },
    "/api/criteria": {
      get: {
        tags: ["Criteria"],
        summary: "Daftar kriteria MFEP",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Criterion" } },
              },
            },
          },
        },
      },
    },
    "/api/recommendations": {
      post: {
        tags: ["Recommendations"],
        summary: "Hitung perangkingan berdasarkan kriteria yang dipilih",
        description:
          "Kirim kode kriteria yang penting. Bobot dibagi rata (total 100%), lalu semua coffee shop dirangking dengan MFEP. Tidak menyimpan data (stateless).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RecommendationRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/RecommendationResponse" } },
            },
          },
          "400": { description: "Tidak ada kriteria valid yang dipilih" },
        },
      },
    },
  },
  components: {
    schemas: {
      CoffeeShop: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          region: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
          wifiSpeed: { type: "integer", description: "Mbps" },
          powerOutlets: { type: "integer" },
          avgPrice: { type: "integer", description: "Rupiah" },
          operatingHours: { type: "integer", description: "jam/hari" },
          noiseLevel: { type: "string", enum: noiseEnum },
          comfort: { type: "string", enum: comfortEnum },
          locationAccess: { type: "string", enum: accessEnum },
        },
      },
      CoffeeShopDetail: {
        allOf: [
          { $ref: "#/components/schemas/CoffeeShop" },
          {
            type: "object",
            properties: {
              scores: {
                type: "object",
                description: "Evaluation factor (1-5) hasil konversi per kriteria",
                additionalProperties: { type: "integer", minimum: 1, maximum: 5 },
                example: { C1: 5, C2: 5, C3: 2, C4: 5, C5: 5, C6: 5, C7: 5 },
              },
            },
          },
        ],
      },
      Criterion: {
        type: "object",
        properties: {
          id: { type: "integer" },
          code: { type: "string", enum: criteriaCodes },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          defaultWeight: { type: "integer", description: "Persen (semua kode = 100)" },
          type: { type: "string", enum: ["benefit", "cost"] },
        },
      },
      RecommendationRequest: {
        type: "object",
        required: ["criteria"],
        properties: {
          criteria: {
            type: "array",
            items: { type: "string", enum: criteriaCodes },
            minItems: 1,
            description: "Kode kriteria yang dipilih",
          },
        },
        example: { criteria: ["C1", "C3", "C6"] },
      },
      FactorBreakdown: {
        type: "object",
        properties: {
          code: { type: "string", enum: criteriaCodes },
          evaluation: { type: "integer", description: "E (1-5)" },
          weightPercent: { type: "integer", description: "W (%)" },
          we: { type: "number", description: "(W/100) x E" },
        },
      },
      RankedShop: {
        type: "object",
        properties: {
          rank: { type: "integer" },
          shopId: { type: "integer" },
          name: { type: "string" },
          totalWe: { type: "number" },
          breakdown: { type: "array", items: { $ref: "#/components/schemas/FactorBreakdown" } },
        },
      },
      RecommendationResponse: {
        type: "object",
        properties: {
          weights: {
            type: "object",
            additionalProperties: { type: "integer" },
            example: { C1: 34, C2: 0, C3: 33, C4: 0, C5: 0, C6: 33, C7: 0 },
          },
          ranking: { type: "array", items: { $ref: "#/components/schemas/RankedShop" } },
        },
      },
    },
  },
} as const;
