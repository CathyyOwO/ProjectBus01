import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpDown, BusFront, Clock3, MapPin, Menu, Search, SlidersHorizontal, X } from "lucide-react";
import { routes } from "../data/mockTransit.js";

function SiteHeader() {
  const [menuOpen,setMenuOpen]=useState(false);
  return <header className="topbar">
    <Link className="brand" to="/"><span className="brand-mark"><BusFront size={22}/></span><span className="brand-copy"><strong>district<span>transit</span></strong><small>เดินทางง่าย ใกล้บ้านคุณ</small></span></Link>
    <nav className={`main-nav ${menuOpen?"is-open":""}`}><Link className="nav-link" to="/">แผนที่สด</Link><Link className="nav-link active" to="/routes">ค้นหาเส้นทาง</Link></nav>
    <div className="header-right"><span className="service-status"><i/> ระบบตัวอย่าง</span><button className="icon-button mobile-menu" onClick={()=>setMenuOpen(v=>!v)} aria-label="เปิดเมนู">{menuOpen?<X size={20}/>:<Menu size={20}/>}</button></div>
  </header>;
}

export default function RouteSearch() {
  const {routeId}=useParams();
  const [query,setQuery]=useState("");
  const [origin,setOrigin]=useState("");
  const [destination,setDestination]=useState("");
  const [category,setCategory]=useState("ทั้งหมด");
  const selected=routes.find(r=>r.id===routeId);
  const results=useMemo(()=>routes.filter(r=>{
    const q=query.trim().toLocaleLowerCase("th");
    return (!q||[r.id,r.shortName,r.name,r.origin,r.destination,...r.stops].some(v=>v.toLocaleLowerCase("th").includes(q)))&&(!origin||r.origin===origin)&&(!destination||r.destination===destination)&&(category==="ทั้งหมด"||r.category===category);
  }),[query,origin,destination,category]);

  return <main className="app-shell route-search-page">
    <SiteHeader/>
    <section className="route-page-heading"><div className="eyebrow"><BusFront size={14}/> DISTRICT TRANSIT · PASSENGER</div><div className="route-title-row"><div><h1>{selected?"รายละเอียดเส้นทาง":"ค้นหาเส้นทางรถโดยสาร"}</h1><p>ค้นหาเส้นทางและจุดจอดในอำเภอบ้านบึง จังหวัดชลบุรี</p></div><span className="mock-pill">ข้อมูลจำลอง · ไม่ใช่ตารางเดินรถจริง</span></div></section>
    {selected?<section className="route-detail-view">
      <Link className="route-back-link" to="/routes"><ArrowLeft size={16}/> กลับไปผลการค้นหา</Link>
      <article className="route-detail-card"><div className="route-detail-top"><span className="route-number-large">{selected.shortName}</span><span className="route-category">{selected.category}</span></div><h2>{selected.name}</h2>
        <div className="route-endpoints"><div><span className="endpoint-dot start"/><small>ต้นทาง</small><strong>{selected.origin}</strong></div><ArrowRight size={19}/><div><span className="endpoint-dot end"/><small>ปลายทาง</small><strong>{selected.destination}</strong></div></div>
        <div className="route-facts"><div><MapPin size={18}/><span>จำนวนป้ายจอด</span><strong>{selected.stopCount} ป้าย</strong></div><div><Clock3 size={18}/><span>เวลาให้บริการ</span><strong>{selected.serviceHours}</strong></div></div>
        <h3>ลำดับป้ายจอด</h3><ol className="route-stop-list">{selected.stops.map((s,i)=><li key={s}><span className="stop-order">{String(i+1).padStart(2,"0")}</span><span>{s}</span>{i===0?<small>ต้นทาง</small>:i===selected.stops.length-1?<small>ปลายทาง</small>:null}</li>)}</ol>
        <p className="route-demo-note">เส้นทางและเวลาให้บริการเป็นข้อมูลตัวอย่าง ยังไม่ได้ยืนยันกับผู้ให้บริการจริง</p>
      </article>
    </section>:<>
      <section className="route-search-card">
        <label className="route-search-input"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นหาชื่อเส้นทางหรือชื่อป้ายรถ เช่น ตลาดบ้านบึง" aria-label="ค้นหาเส้นทางหรือป้ายรถ"/>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="ล้างคำค้น"><X size={17}/></button>}</label>
        <div className="route-select-row"><label className="route-select-field"><span>ต้นทาง</span><select value={origin} onChange={e=>setOrigin(e.target.value)}><option value="">ทุกต้นทาง</option>{[...new Set(routes.map(r=>r.origin))].map(s=><option key={s}>{s}</option>)}</select></label><button className="swap-route-button" type="button" aria-label="สลับต้นทางและปลายทาง" onClick={()=>{setOrigin(destination);setDestination(origin)}}><ArrowUpDown size={17}/></button><label className="route-select-field"><span>ปลายทาง</span><select value={destination} onChange={e=>setDestination(e.target.value)}><option value="">ทุกปลายทาง</option>{[...new Set(routes.map(r=>r.destination))].map(s=><option key={s}>{s}</option>)}</select></label></div>
        <div className="route-filter-row"><span><SlidersHorizontal size={15}/> กรองเส้นทาง</span>{["ทั้งหมด","ชุมชน"].map(v=><button type="button" key={v} className={category===v?"filter-chip selected":"filter-chip"} onClick={()=>setCategory(v)}>{v}</button>)}</div>
      </section>
      <section className="route-results"><div className="route-results-heading"><div><h2>เส้นทางที่ค้นพบ</h2><p>เลือกเส้นทางเพื่อดูรายละเอียดและลำดับป้ายจอด</p></div><span className="count-pill">{results.length} เส้นทาง</span></div>
        {results.length?<div className="route-result-list">{results.map(r=><Link className="route-result-card" to={`/routes/${r.id}`} key={r.id}><span className="route-result-icon"><BusFront size={21}/></span><span className="route-result-main"><span className="route-result-code">{r.shortName} <small>{r.category}</small></span><strong>{r.name}</strong><span className="route-result-places"><MapPin size={13}/>{r.origin}<ArrowRight size={13}/>{r.destination}</span><span className="route-result-meta"><span><MapPin size={13}/>{r.stopCount} ป้ายจอด</span><span><Clock3 size={13}/>{r.serviceHours}</span></span></span><ArrowRight className="route-result-arrow" size={19}/></Link>)}</div>:<div className="route-no-results"><span className="no-results-icon"><Search size={25}/></span><h3>ไม่พบเส้นทางที่ตรงกับการค้นหา</h3><p>ลองเปลี่ยนชื่อเส้นทาง ป้ายรถ หรือตัวเลือกต้นทางและปลายทาง</p><button type="button" className="clear-filters-button" onClick={()=>{setQuery("");setOrigin("");setDestination("");setCategory("ทั้งหมด")}}>ล้างตัวกรองทั้งหมด</button></div>}
      </section>
    </>}
    <footer className="footer"><span>© 2026 District Transit</span><span>ระบบตัวอย่าง · อำเภอบ้านบึง จังหวัดชลบุรี</span></footer>
  </main>;
}