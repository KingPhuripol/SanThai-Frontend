import axios from "axios";
import type {
  FabricPattern,
  ProvenanceResponse,
  Product,
  SearchResponse,
  Recommendation,
  DashboardResponse,
} from "./types";
import { getToken, Session } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const cleanImageUrls = (data: any): any => {
  if (!data) return data;
  if (typeof data === "string") {
    if (data.startsWith("http://localhost:8000/")) {
      return data.replace("http://localhost:8000", API_URL);
    }
    if (data.startsWith("http://127.0.0.1:8000/")) {
      return data.replace("http://127.0.0.1:8000", API_URL);
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(cleanImageUrls);
  }
  if (typeof data === "object") {
    const cleaned: any = {};
    for (const key in data) {
      cleaned[key] = cleanImageUrls(data[key]);
    }
    return cleaned;
  }
  return data;
};

api.interceptors.response.use((response) => {
  response.data = cleanImageUrls(response.data);
  return response;
});

// ─── Fabrics ──────────────────────────────────────────────────────────────────

export const fabricsApi = {
  list: async (params?: {
    skip?: number;
    limit?: number;
    region?: string;
    weave_technique?: string;
  }): Promise<FabricPattern[]> => {
    const { data } = await api.get("/api/fabrics/", { params });
    return data;
  },

  get: async (id: number): Promise<FabricPattern> => {
    const { data } = await api.get(`/api/fabrics/${id}`);
    return data;
  },

  getProvenance: async (id: number): Promise<ProvenanceResponse> => {
    const { data } = await api.get(`/api/fabrics/${id}/provenance`);
    return data;
  },

  upload: async (
    formData: FormData,
  ): Promise<{ id: number; name_th: string; message: string; ai_processing: boolean }> => {
    const { data } = await api.post("/api/fabrics/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  recognize: async (
    file: File,
  ): Promise<{
    vision_analysis: any;
    matches: import("./types").RecognizeMatch[];
    needs_human_review: boolean;
  }> => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await api.post("/api/fabrics/recognize", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (
    fabricId: number,
    formData: FormData,
  ): Promise<{ id: number; message: string }> => {
    const { data } = await api.put(`/api/fabrics/${fabricId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  verifyFabric: async (imageBase64: string): Promise<any> => {
    const { data } = await api.post("/api/verify/fabric", { image_base64: imageBase64 });
    return data;
  }
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  list: async (params?: {
    province?: string;
    weave_technique?: string;
    max_price_thb?: number;
    artisan_id?: number;
    skip?: number;
    limit?: number;
  }): Promise<Product[]> => {
    const { data } = await api.get("/api/products/", { params });
    return data;
  },

  get: async (id: number): Promise<Product> => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },

  createOrder: async (params: {
    product_id: number;
    buyer_email: string;
    buyer_name?: string;
    buyer_address?: string;
    quantity?: number;
    variant_id?: number;
  }): Promise<any> => {
    const { data } = await api.post("/api/products/orders", null, { params });
    return data;
  },

  uploadSlip: async (orderId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("slip", file);
    const res = await api.post(`/api/products/orders/${orderId}/slip`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  
  checkoutCart: async (data: any): Promise<any> => {
    const res = await api.post("/api/products/checkout_cart", data);
    return res.data;
  },

  upload: async (
    formData: FormData,
  ): Promise<{ id: number; title_th: string; message: string }> => {
    const { data } = await api.post("/api/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (
    productId: number,
    formData: FormData,
  ): Promise<{ id: number; message: string }> => {
    const { data } = await api.put(`/api/products/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (productId: number): Promise<{ id: number; message: string }> => {
    const { data } = await api.delete(`/api/products/${productId}`);
    return data;
  },
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchApi = {
  search: async (q: string, province?: string): Promise<SearchResponse> => {
    const { data } = await api.get("/api/search/", { params: { q, province } });
    return data;
  },
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const chatApi = {
  send: async (
    message: string,
    sessionId: string,
  ): Promise<{ reply: string; session_id: string }> => {
    const { data } = await api.post("/api/chat/", {
      message,
      session_id: sessionId,
    });
    return data;
  },
};

// ─── Artisan ──────────────────────────────────────────────────────────────────

export const artisanApi = {
  getDashboard: async (artisanId: number): Promise<DashboardResponse> => {
    const { data } = await api.get(`/api/artisan/dashboard/${artisanId}`);
    return data;
  },

  getRecommendations: async (params: {
    occasion: string;
    personality: string;
    preferred_color: string;
    budget_thb: number;
    gender: string;
  }): Promise<{ recommendations: Recommendation[] }> => {
    const { data } = await api.get("/api/artisan/quiz/recommend", { params });
    return data;
  },

  updateOrderStatus: async (orderId: number, updateData: {
    status: string;
    tracking_number?: string;
    courier?: string;
  }): Promise<any> => {
    const { data } = await api.put(`/api/artisan/orders/${orderId}/status`, updateData);
    return data;
  },
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: async (payload: {
    role: "artisan" | "designer" | "customer";
    email: string;
    password: string;
    full_name: string;
    community_name?: string;
    province?: string;
    region?: string;
    bio_th?: string;
  }): Promise<Session> => {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
  },

  login: async (email: string, password: string): Promise<Session> => {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data;
  },
};

// ─── Designer ─────────────────────────────────────────────────────────────────

export const designerApi = {
  getDashboard: async (designerId: string): Promise<any> => {
    const { data } = await api.get(`/api/designer/dashboard/${designerId}`);
    return data;
  },

  updateOrderStatus: async (orderId: number, updateData: {
    status: string;
    tracking_number?: string;
    courier?: string;
  }): Promise<any> => {
    const { data } = await api.put(`/api/designer/orders/${orderId}/status`, updateData);
    return data;
  },

  generateFashionImage: async (fabricId: number, garmentStyle: string): Promise<{ image_url: string }> => {
    const fd = new FormData();
    fd.append("fabric_id", String(fabricId));
    fd.append("garment_style", garmentStyle);
    const { data } = await api.post("/api/designer/generate-fashion-image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return data;
  },
};

// ─── Orders (customer's own order history) ────────────────────────────────────

export const ordersApi = {
  my: async (): Promise<any[]> => {
    const { data } = await api.get("/api/products/orders/my");
    return data;
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: async (): Promise<any> => {
    const { data } = await api.get("/api/admin/stats");
    return data;
  },

  getUsers: async (role?: string): Promise<any[]> => {
    const { data } = await api.get("/api/admin/users", { params: role ? { role } : {} });
    return data;
  },

  verifyArtisan: async (artisanId: number): Promise<any> => {
    const { data } = await api.put(`/api/admin/artisans/${artisanId}/verify`);
    return data;
  },

  suspendUser: async (userId: string): Promise<any> => {
    const { data } = await api.put(`/api/admin/users/${userId}/suspend`);
    return data;
  },

  unsuspendUser: async (userId: string): Promise<any> => {
    const { data } = await api.put(`/api/admin/users/${userId}/unsuspend`);
    return data;
  },

  getOrders: async (): Promise<any[]> => {
    const { data } = await api.get("/api/admin/orders");
    return data;
  },

  updateOrderStatus: async (orderId: number, updateData: {
    status: string;
    tracking_number?: string;
    courier?: string;
  }): Promise<any> => {
    const { data } = await api.put(`/api/admin/orders/${orderId}/status`, updateData);
    return data;
  },
};
