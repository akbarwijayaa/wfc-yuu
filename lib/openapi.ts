// OpenAPI 3.1 document describing the SPK Coffee Shop REST API.
// Served at /api/openapi and rendered by Scalar at /docs.
// Endpoint order/tags follow the design document (BAB 4.1.2) so the Scalar
// sidebar maps one-to-one to the report sections.

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
    { name: "Auth", description: "Registrasi & login (session cookie)" },
    { name: "Dashboard", description: "Ringkasan dashboard admin/pengunjung" },
    { name: "Coffee Shops", description: "Data alternatif coffee shop" },
    { name: "Criteria", description: "Kriteria evaluasi MFEP" },
    { name: "Recommendations", description: "Perangkingan MFEP" },
    { name: "History", description: "Riwayat rekomendasi pengunjung" },
  ],
  paths: {
    // 4.1.2.1 Registrasi
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrasi akun pengunjung baru",
        description:
          "Membuat akun pengunjung, membuka session (cookie httpOnly), dan mengembalikan data pengguna.",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } },
          },
        },
        responses: {
          "201": {
            description: "Akun dibuat",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthUser" } },
            },
          },
          "400": { description: "Input tidak valid", content: errorContent() },
          "409": { description: "Username atau email sudah terdaftar", content: errorContent() },
        },
      },
    },
    // 4.1.2.2 Login
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login admin & pengunjung",
        description: "Memverifikasi kredensial dan membuka session (cookie httpOnly).",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } },
          },
        },
        responses: {
          "200": {
            description: "Berhasil login",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/AuthUser" } },
            },
          },
          "400": { description: "Input tidak valid", content: errorContent() },
          "401": { description: "Username atau password salah", content: errorContent() },
        },
      },
    },
    // 4.1.2.3 Dashboard
    "/api/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Data dashboard sesuai peran",
        description:
          "Admin menerima jumlah data (coffee shop, kriteria, pengguna, sesi rekomendasi); pengunjung menerima daftar coffee shop. Butuh session.",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/DashboardResponse" } },
            },
          },
          "401": { description: "Belum login", content: errorContent() },
        },
      },
    },
    // 4.1.2.4 Coffee Shops
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
      post: {
        tags: ["Coffee Shops"],
        summary: "Tambah coffee shop (admin)",
        description: "Membuat data coffee shop baru. Hanya admin.",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CoffeeShopInput" } },
          },
        },
        responses: {
          "201": {
            description: "Coffee shop dibuat",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CoffeeShop" } },
            },
          },
          "400": { description: "Input tidak valid", content: errorContent() },
          "401": { description: "Belum login", content: errorContent() },
          "403": { description: "Butuh akses admin", content: errorContent() },
        },
      },
    },
    "/api/coffee-shops/{id}": {
      get: {
        tags: ["Coffee Shops"],
        summary: "Detail coffee shop beserta skor evaluasi (E) per kriteria",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CoffeeShopDetail" } },
            },
          },
          "404": { description: "Coffee shop tidak ditemukan", content: errorContent() },
        },
      },
      put: {
        tags: ["Coffee Shops"],
        summary: "Ubah coffee shop (admin)",
        description: "Memperbarui data coffee shop. Hanya admin.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CoffeeShopInput" } },
          },
        },
        responses: {
          "200": {
            description: "Coffee shop diperbarui",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CoffeeShop" } },
            },
          },
          "400": { description: "Input tidak valid", content: errorContent() },
          "401": { description: "Belum login", content: errorContent() },
          "403": { description: "Butuh akses admin", content: errorContent() },
          "404": { description: "Coffee shop tidak ditemukan", content: errorContent() },
        },
      },
      delete: {
        tags: ["Coffee Shops"],
        summary: "Hapus coffee shop (admin)",
        description:
          "Menghapus coffee shop beserta referensinya di detail rekomendasi. Hanya admin.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          "200": {
            description: "Terhapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean" } },
                  example: { ok: true },
                },
              },
            },
          },
          "401": { description: "Belum login", content: errorContent() },
          "403": { description: "Butuh akses admin", content: errorContent() },
          "404": { description: "Coffee shop tidak ditemukan", content: errorContent() },
        },
      },
    },
    // 4.1.2.5 Kriteria
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
      put: {
        tags: ["Criteria"],
        summary: "Ubah bobot default kriteria (admin)",
        description: "Memperbarui bobot default C1..C7. Total harus tepat 100. Hanya admin.",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/WeightsInput" } },
          },
        },
        responses: {
          "200": {
            description: "Bobot diperbarui",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Criterion" } },
              },
            },
          },
          "400": { description: "Total bobot harus tepat 100%", content: errorContent() },
          "401": { description: "Belum login", content: errorContent() },
          "403": { description: "Butuh akses admin", content: errorContent() },
        },
      },
    },
    // 4.1.2.6 Rekomendasi
    "/api/recommendations/options": {
      get: {
        tags: ["Recommendations"],
        summary: "Opsi preferensi untuk membuat rekomendasi",
        description:
          "Daftar kriteria yang bisa dipilih pengunjung sebagai preferensi (checklist) sebelum menghitung rekomendasi. Setara GET /rekomendasi pada dokumen desain.",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    options: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CriterionOption" },
                    },
                  },
                },
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
          "400": { description: "Tidak ada kriteria valid yang dipilih", content: errorContent() },
        },
      },
    },
    "/api/recommendations/{id}": {
      get: {
        tags: ["Recommendations"],
        summary: "Hasil rekomendasi tersimpan",
        description:
          "Mengambil satu sesi rekomendasi milik pengguna beserta perangkingannya. Butuh session; sesi milik pengguna lain dilaporkan 404.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, example: 1 },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/SavedRecommendation" } },
            },
          },
          "401": { description: "Belum login", content: errorContent() },
          "404": { description: "Rekomendasi tidak ditemukan", content: errorContent() },
        },
      },
    },
    // 4.1.2.7 Riwayat
    "/api/history": {
      get: {
        tags: ["History"],
        summary: "Riwayat rekomendasi pengunjung",
        description: "Daftar sesi rekomendasi milik pengguna, terbaru dahulu. Butuh session.",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/HistoryItem" } },
              },
            },
          },
          "401": { description: "Belum login", content: errorContent() },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
        example: { error: "Belum login" },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "username", "password"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          username: { type: "string", minLength: 3 },
          password: { type: "string", minLength: 6 },
        },
        example: {
          name: "Budi Santoso",
          email: "budi@example.com",
          username: "budi",
          password: "rahasia123",
        },
      },
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
        example: { username: "user", password: "user123" },
      },
      AuthUser: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          username: { type: "string" },
          role: { type: "string", enum: ["admin", "visitor"] },
        },
      },
      DashboardResponse: {
        oneOf: [
          { $ref: "#/components/schemas/AdminDashboard" },
          { $ref: "#/components/schemas/VisitorDashboard" },
        ],
      },
      AdminDashboard: {
        type: "object",
        properties: {
          role: { type: "string", enum: ["admin"] },
          counts: {
            type: "object",
            properties: {
              coffeeShops: { type: "integer" },
              criteria: { type: "integer" },
              users: { type: "integer" },
              recommendations: { type: "integer" },
            },
          },
        },
        example: { role: "admin", counts: { coffeeShops: 10, criteria: 7, users: 2, recommendations: 0 } },
      },
      VisitorDashboard: {
        type: "object",
        properties: {
          role: { type: "string", enum: ["visitor"] },
          coffeeShops: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                region: { type: "string", nullable: true },
                wifiSpeed: { type: "integer" },
                avgPrice: { type: "integer" },
              },
            },
          },
        },
      },
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
      CoffeeShopInput: {
        type: "object",
        required: [
          "name",
          "wifiSpeed",
          "powerOutlets",
          "avgPrice",
          "operatingHours",
          "noiseLevel",
          "comfort",
          "locationAccess",
        ],
        properties: {
          name: { type: "string", minLength: 2 },
          address: { type: "string" },
          region: { type: "string" },
          wifiSpeed: { type: "integer", minimum: 0, description: "Mbps" },
          powerOutlets: { type: "integer", minimum: 0 },
          avgPrice: { type: "integer", minimum: 0, description: "Rupiah" },
          operatingHours: { type: "integer", minimum: 0, maximum: 24 },
          noiseLevel: { type: "string", enum: noiseEnum },
          comfort: { type: "string", enum: comfortEnum },
          locationAccess: { type: "string", enum: accessEnum },
          description: { type: "string" },
          photoUrl: { type: "string" },
        },
        example: {
          name: "Kopi Contoh",
          address: "Jl. Contoh No. 1, Yogyakarta",
          region: "Kota Yogyakarta",
          wifiSpeed: 20,
          powerOutlets: 8,
          avgPrice: 18000,
          operatingHours: 14,
          noiseLevel: "Rendah",
          comfort: "Nyaman",
          locationAccess: "Mudah",
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
      CriterionOption: {
        type: "object",
        properties: {
          id: { type: "integer" },
          code: { type: "string", enum: criteriaCodes },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          type: { type: "string", enum: ["benefit", "cost"] },
        },
      },
      WeightsInput: {
        type: "object",
        required: criteriaCodes,
        properties: Object.fromEntries(
          criteriaCodes.map((c) => [c, { type: "integer", minimum: 0, maximum: 100 }])
        ),
        description: "Bobot per kode; total harus tepat 100.",
        example: { C1: 20, C2: 10, C3: 15, C4: 10, C5: 15, C6: 15, C7: 15 },
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
      SavedRecommendation: {
        type: "object",
        properties: {
          id: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          weights: {
            type: "object",
            additionalProperties: { type: "integer" },
          },
          ranking: { type: "array", items: { $ref: "#/components/schemas/RankedShop" } },
        },
      },
      HistoryItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          topShop: { type: "string", nullable: true, description: "Coffee shop peringkat 1" },
        },
      },
    },
  },
} as const;

function errorContent() {
  return { "application/json": { schema: { $ref: "#/components/schemas/Error" } } };
}
