export interface Community {
  name: string;
  name_en?: string;
  province: string;
  province_en?: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

export interface Artisan {
  id: number;
  name: string;
  verified?: boolean;
  province?: string;
  bio_th?: string;
  bio_en?: string;
  avatar_url?: string;
}

export interface StoryTags {
  occasions?: string[];
  cultural_tags?: string[];
  color_palette?: string[];
  symbolism?: string[];
  weave_type?: string;
}

export interface FabricPattern {
  id: number;
  name_th: string;
  name_en?: string;
  artisan?: Artisan;
  community?: Community;
  weave_technique?: string;
  dye_method?: string;
  fiber_type?: string;
  cultural_meaning_th?: string;
  cultural_meaning_en?: string;
  usage_rights: "commercial" | "personal" | "restricted";
  story_tags?: StoryTags;
  image_url?: string;
  ai_processed: boolean;
  created_at: string;
}

export interface ProvenanceEvent {
  id: number;
  event_type: string;
  actor_name: string;
  location?: string;
  description_th?: string;
  description_en?: string;
  timestamp: string;
  hash: string;
  prev_hash: string;
}

export interface ProvenanceResponse {
  fabric_id: number;
  chain_valid: boolean;
  total_events: number;
  events: ProvenanceEvent[];
}

export interface Product {
  id: number;
  product_code?: string;
  title_th: string;
  title_en?: string;
  description_th?: string;
  description_en?: string;
  price_thb: number;
  price_usd: number;
  stock: number;
  category?: string;
  is_active?: boolean;
  product_type?: string;
  preparation_time?: string;
  shipping_provider?: string;
  shipping_cost_thb?: number;
  free_shipping?: boolean;
  listing_status?: "draft" | "pending_review" | "changes_requested" | "active" | "paused" | "out_of_stock" | "archived";
  sale_unit?: "meter" | "piece" | "roll" | "set";
  width_cm?: number;
  length_cm?: number;
  weight_g?: number;
  fiber_composition?: string;
  primary_color?: string;
  dye_method?: string;
  pattern_name?: string;
  texture?: string;
  production_method?: string;
  production_origin?: string;
  care_instructions?: string;
  available_at?: string;
  published_at?: string;
  passport?: {
    code: string;
    status: "seller_declared" | "pending_verification" | "verified" | "revoked";
    issued_at?: string;
  } | null;
  images: string[];
  variants?: ProductVariant[];
  fabric_id?: number;
  fabric?: FabricPattern;
  artisan?: Artisan;
  community?: Community;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size?: string;
  color?: string;
  additional_price_thb: number;
  stock_override?: number | null;
}

export interface OrderShipping {
  status: string;
  courier?: string | null;
  tracking_number?: string | null;
}

export interface OrderResponse {
  id: number;
  status: string;
  total_thb: number;
  total_usd: number;
  variant?: ProductVariant | null;
  shipping?: OrderShipping;
  promptpay_payload: string;
}

export interface SearchResult {
  fabric_id: number;
  product_id?: number;
  name_th: string;
  name_en?: string;
  image_url?: string;
  weave_technique?: string;
  dye_method?: string;
  cultural_meaning_th?: string;
  cultural_meaning_en?: string;
  story_tags?: StoryTags;
  usage_rights: string;
  artisan_name?: string;
  province?: string;
  community_name?: string;
  price_thb?: number;
  price_usd?: number;
  relevance_score: number;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}

export interface Recommendation {
  fabric_id: number;
  product_id?: number;
  name_th: string;
  name_en?: string;
  cultural_meaning_th?: string;
  cultural_meaning_en?: string;
  image_url?: string;
  artisan_name?: string;
  province?: string;
  price_thb?: number;
  price_usd?: number;
  match_score: number;
  reason: string;
}

export interface DashboardStats {
  artisan_name: string;
  community_name: string;
  province: string;
  total_revenue_thb: number;
  total_revenue_usd: number;
  total_orders: number;
  active_products: number;
  registered_fabrics: number;
  community_share_thb: number;
}

export interface RevenueTrend {
  month: string;
  revenue_thb: number;
  orders: number;
}

export interface FabricItem {
  id: number;
  name_th: string;
  name_en?: string;
  image_url?: string;
  weave_technique?: string;
  fiber_type?: string;
  ai_processed: boolean;
}

export interface DashboardResponse {
  artisan: Artisan;
  stats: DashboardStats;
  fabrics: FabricItem[];
  revenue_trend: RevenueTrend[];
  recent_orders?: DashboardOrder[];
}

export interface DashboardOrder {
  id: number;
  product_id: number;
  product_title: string;
  product_image?: string;
  variant?: { size?: string; color?: string } | null;
  buyer_name?: string;
  buyer_email: string;
  buyer_address?: string;
  quantity: number;
  total_thb: number;
  status: string;
  courier?: string | null;
  tracking_number?: string | null;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface RecognizeMatch {
  fabric_id: number;
  name_th: string;
  name_en?: string;
  image_url?: string;
  weave_technique?: string;
}
