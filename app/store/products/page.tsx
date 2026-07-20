"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Edit2, Trash2, Search } from "lucide-react";
import { getSession } from "@/lib/auth";
import { productsApi } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";

export default function ManageProductsPage() {
  const { locale, pick } = useLanguage();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (session && session.artisan_id) {
        const data = await productsApi.list({ artisan_id: session.artisan_id, include_inactive: true });
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if(confirm(locale === "en" ? "Delete this product?" : "คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      try {
        await productsApi.delete(id);
        fetchProducts(); // refresh list
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(locale === "en" ? "Could not delete product." : "ลบสินค้าไม่สำเร็จ");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-32">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/store" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-900 shadow-sm hover:bg-brand-50 transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-brand-950 thai-serif">{locale === "en" ? "Manage products" : "จัดการสินค้า"}</h1>
              <p className="text-brand-900/60 text-sm">{locale === "en" ? "Edit, delete, or add products." : "แก้ไข ลบ หรือเพิ่มสินค้าใหม่"}</p>
            </div>
          </div>
          <Link
            href="/store/products/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-900 to-brand-800 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-brand-900/20 hover:scale-105 transition-transform"
          >
            <Plus size={20} className="text-gold-400" />
            {locale === "en" ? "Add product" : "เพิ่มสินค้าใหม่"}
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-200/50 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-900/40" size={20} />
            <input 
              type="text" 
              placeholder={locale === "en" ? "Search products…" : "ค้นหาสินค้า..."}
              className="w-full bg-brand-50 border border-brand-100 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-[24px] shadow-sm border border-brand-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-100 text-brand-900/70 text-sm font-bold">
                  <th className="p-4 pl-6">{locale === "en" ? "Product" : "สินค้า"}</th>
                  <th className="p-4">{locale === "en" ? "Price" : "ราคา"}</th>
                  <th className="p-4">{locale === "en" ? "Stock" : "สต็อก"}</th>
                  <th className="p-4">{locale === "en" ? "Status" : "สถานะ"}</th>
                  <th className="p-4 pr-6 text-right">{locale === "en" ? "Actions" : "จัดการ"}</th>
                </tr>
              </thead>
              <tbody>
                {products.filter((product) => `${product.title_th || ""} ${product.title_en || ""}`.toLowerCase().includes(query.toLowerCase())).map((product) => (
                  <tr key={product.id} className="border-b border-brand-100/50 hover:bg-brand-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={pick(product.title_th, product.title_en)} className="w-16 h-16 rounded-lg object-cover border border-brand-100" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 border border-brand-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500">{locale === "en" ? "No image" : "ไม่มีรูป"}</span>
                          </div>
                        )}
                        <span className="font-bold text-brand-900">{pick(product.title_th, product.title_en)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-brand-900">
                      {locale === "en" ? `$${(product.price_thb / 35).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `฿${product.price_thb.toLocaleString()}`}
                    </td>
                    <td className="p-4 font-medium text-brand-900">
                      {product.stock}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.is_active ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
                        {product.is_active ? (locale === "en" ? "Published" : "กำลังขาย") : (locale === "en" ? "Draft" : "แบบร่าง")}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button 
                        onClick={() => router.push(`/store/products/add?edit=${product.id}`)}
                        className="p-2 text-brand-900/60 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-colors inline-block"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-brand-900/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-brand-900/50 font-medium">
                      {locale === "en" ? "No products found" : "ไม่พบรายการสินค้า"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
