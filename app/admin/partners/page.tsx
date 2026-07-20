"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { useAdminSession } from "@/lib/useAdminSession";
import { ChevronLeft, Plus, Save, Trash2 } from "lucide-react";

const blank = { partner_name: "", organization: "", partner_type: "", contact_name: "", phone: "", email: "", status: "to_contact", contacted_at: "", contact_result: "", owner_name: "", next_action: "", next_action_at: "", notes: "" };
const labels: Record<string, string> = { to_contact: "จะติดต่อ", contacted: "ติดต่อแล้ว", in_progress: "กำลังติดต่อ", won: "ร่วมงานแล้ว", not_interested: "ยังไม่สนใจ" };

export default function PartnersPage() {
  const { session, checked } = useAdminSession();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => adminApi.getPartners().then(setRows).finally(() => setLoading(false));
  useEffect(() => { if (session) load(); }, [session]);
  const set = (key: string, value: string) => setForm((current: any) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.partner_name.trim()) return alert("กรุณาระบุชื่อพาร์ทเนอร์");
    if (editing) await adminApi.updatePartner(editing, form); else await adminApi.createPartner(form);
    setForm(blank); setEditing(null); load();
  };
  const edit = (row: any) => { setEditing(row.id); setForm({ ...blank, ...row, contacted_at: row.contacted_at || "", next_action_at: row.next_action_at || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  if (!checked || loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;
  return <main className="min-h-screen bg-stone-50 pt-24 pb-16 px-4"><div className="max-w-6xl mx-auto"><Link href="/admin/dashboard" className="inline-flex gap-1 text-sm font-bold text-brand-800 mb-5"><ChevronLeft size={18}/> Admin dashboard</Link><h1 className="text-3xl thai-serif font-bold text-brand-950">Partner CRM</h1><p className="text-sm text-brand-900/60 mb-6">ติดตามพาร์ทเนอร์ สถานะ ผลการติดต่อ ผู้รับผิดชอบ และงานถัดไป</p><form onSubmit={submit} className="bg-white border border-amber-100 rounded-2xl p-5 grid md:grid-cols-3 gap-3 mb-6"><input required value={form.partner_name} onChange={e=>set("partner_name", e.target.value)} placeholder="ชื่อพาร์ทเนอร์ *" className="field"/><input value={form.organization} onChange={e=>set("organization", e.target.value)} placeholder="องค์กร / ร้าน" className="field"/><input value={form.partner_type} onChange={e=>set("partner_type", e.target.value)} placeholder="ประเภทพาร์ทเนอร์" className="field"/><input value={form.contact_name} onChange={e=>set("contact_name", e.target.value)} placeholder="ผู้ติดต่อ" className="field"/><input value={form.phone} onChange={e=>set("phone", e.target.value)} placeholder="โทรศัพท์" className="field"/><input value={form.email} onChange={e=>set("email", e.target.value)} placeholder="อีเมล" className="field"/><select value={form.status} onChange={e=>set("status", e.target.value)} className="field">{Object.entries(labels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><input type="date" value={form.contacted_at} onChange={e=>set("contacted_at", e.target.value)} className="field"/><input value={form.owner_name} onChange={e=>set("owner_name", e.target.value)} placeholder="ผู้รับผิดชอบ" className="field"/><input value={form.contact_result} onChange={e=>set("contact_result", e.target.value)} placeholder="ผลการติดต่อ" className="field md:col-span-2"/><input value={form.next_action} onChange={e=>set("next_action", e.target.value)} placeholder="Next action" className="field"/><input type="date" value={form.next_action_at} onChange={e=>set("next_action_at", e.target.value)} className="field"/><textarea value={form.notes} onChange={e=>set("notes", e.target.value)} placeholder="หมายเหตุ" className="field md:col-span-2 min-h-10"/><div className="flex gap-2"><button className="rounded-xl bg-brand-900 text-white px-4 py-2 text-sm font-bold flex gap-1 items-center"><Save size={15}/>{editing ? "บันทึก" : "เพิ่มพาร์ทเนอร์"}</button>{editing && <button type="button" onClick={()=>{setEditing(null);setForm(blank)}} className="text-sm font-bold px-3">ยกเลิก</button>}</div></form><div className="bg-white border border-amber-100 rounded-2xl overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-amber-50 text-brand-900/70"><tr><th className="p-3 text-left">พาร์ทเนอร์</th><th className="p-3 text-left">สถานะ</th><th className="p-3 text-left">ติดต่อ / ผล</th><th className="p-3 text-left">ผู้รับผิดชอบ</th><th className="p-3 text-left">Next action</th><th className="p-3"/></tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-t border-amber-50"><td className="p-3 font-bold">{row.partner_name}<p className="font-normal text-xs text-brand-900/55">{row.organization || row.contact_name || "-"}</p></td><td className="p-3">{labels[row.status]}</td><td className="p-3">{row.contacted_at || "-"}<p className="text-xs text-brand-900/60">{row.contact_result || "-"}</p></td><td className="p-3">{row.owner_name || "-"}</td><td className="p-3">{row.next_action || "-"}<p className="text-xs text-brand-900/60">{row.next_action_at || ""}</p></td><td className="p-3 whitespace-nowrap"><button onClick={()=>edit(row)} className="text-brand-800 font-bold mr-3">แก้ไข</button><button onClick={async()=>{if(confirm("ลบพาร์ทเนอร์นี้?") ){await adminApi.deletePartner(row.id);load()}}} className="text-red-500"><Trash2 size={15}/></button></td></tr>)}{rows.length===0&&<tr><td colSpan={6} className="p-8 text-center text-brand-900/50">ยังไม่มีพาร์ทเนอร์</td></tr>}</tbody></table></div></div></main>;
}
