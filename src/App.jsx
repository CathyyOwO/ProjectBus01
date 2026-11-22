import { useMemo, useState } from "react";
import { BusFront, MapPinned, Menu, Search, X } from "lucide-react";
import TransitMap from "./components/TransitMap.jsx";
import BusDetailSheet from "./components/BusDetailSheet.jsx";
import { buses, routes } from "./data/mockTransit.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [activeRoute, setActiveRoute] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredBuses = useMemo(() => buses.filter((bus) => {
    const text = query.trim().toLowerCase();
    const matchesText = !text || [bus.code, bus.routeName, bus.destination].some((value) => value.toLowerCase().includes(text));
    const matchesRoute = activeRoute === "all" || bus.routeId === activeRoute;
    return matchesText && matchesRoute;
  }), [query, activeRoute]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="District Transit หน้าแรก">
          <span className="brand-mark"><BusFront size={22} strokeWidth={2.5} /></span>
          <span className="brand-copy"><strong>district<span>transit</span></strong><small>เดินทางง่าย ใกล้บ้านคุณ</small></span>
        </a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="เมนูหลัก">
          <a className="nav-link active" href="#map" onClick={() => setMenuOpen(false)}>แผนที่สด</a>
          <a className="nav-link" href="#routes" onClick={() => setMenuOpen(false)}>เส้นทาง</a>
          <a className="nav-link" href="#stops" onClick={() => setMenuOpen(false)}>ป้ายจอด</a>
        </nav>
        <div className="header-right">
          <span className="service-status"><i /> ระบบตัวอย่าง</span>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <section className="page-heading">
        <div>
          <div className="eyebrow"><MapPinned size={14} /> DISTRICT TRANSIT · PASSENGER</div>
          <h1>รถโดยสารรอบตัวคุณ</h1>
          <p>ค้นหาเส้นทางและติดตามตำแหน่งรถโดยสารได้ในที่เดียว</p>
        </div>
        <div className="live-indicator"><span className="pulse-dot" /> ข้อมูลสาธิต · ไม่ใช่ GPS จริง</div>
      </section>

      <section className="workspace" id="map">
        <aside className="sidebar">
          <div className="search-box">
            <Search size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาสายรถ ปลายทาง หรือเลขรถ" aria-label="ค้นหาเส้นทางหรือรถโดยสาร" />
            {query && <button className="clear-search" onClick={() => setQuery("")} aria-label="ล้างคำค้น"><X size={16} /></button>}
          </div>

          <div className="section-row" id="routes">
            <div><h2>เส้นทางรถโดยสาร</h2><p>เลือกสายเพื่อกรองรถบนแผนที่</p></div>
            <span className="count-pill">{filteredBuses.length} คัน</span>
          </div>
          <div className="route-filters">
            <button className={activeRoute === "all" ? "filter-chip selected" : "filter-chip"} onClick={() => setActiveRoute("all")}>ทั้งหมด</button>
            {routes.map((route) => <button key={route.id} className={activeRoute === route.id ? "filter-chip selected" : "filter-chip"} onClick={() => setActiveRoute(route.id)}>{route.shortName}</button>)}
          </div>

          <div className="bus-list">
            {filteredBuses.length ? filteredBuses.map((bus) => (
              <button key={bus.id} className={`bus-card ${selectedBus?.id === bus.id ? "chosen" : ""}`} onClick={() => setSelectedBus(bus)}>
                <span className="bus-icon"><BusFront size={19} /></span>
                <span className="bus-card-main">
                  <strong>{bus.code}<small>{bus.routeName}</small></strong>
                  <span className="bus-destination">ไปยัง {bus.destination}</span>
                </span>
                <span className={bus.status === "กำลังให้บริการ" ? "status-tag moving" : "status-tag stopped"}>{bus.status}</span>
              </button>
            )) : <div className="empty-state"><Search size={22} /><strong>ไม่พบรถโดยสาร</strong><span>ลองค้นหาด้วยชื่อสายหรือเลขรถอื่น</span></div>}
          </div>

          <div className="sidebar-note"><span className="note-icon">i</span><span>ตำแหน่งรถและความเร็วในหน้านี้เป็นข้อมูล Mock Data เพื่อสาธิตการใช้งาน</span></div>
        </aside>

        <div className="map-panel">
          <div className="map-top-label"><span className="map-live-dot" /> แผนที่เครือข่ายรถโดยสาร <span className="map-label-divider" /> <span>ตัวอย่างพื้นที่ให้บริการ</span></div>
          <TransitMap buses={filteredBuses} selectedBus={selectedBus} onSelectBus={setSelectedBus} />
          <div className="map-legend">
            <span><i className="legend-bus" /> รถโดยสาร</span>
            <span><i className="legend-stop" /> ป้ายจอด</span>
            <span><i className="legend-route" /> เส้นทาง</span>
          </div>
          <div className="map-disclaimer">แผนที่และตำแหน่งรถเป็นข้อมูลสาธิต ไม่ใช่ตำแหน่งรถแบบเรียลไทม์</div>
        </div>
      </section>

      <BusDetailSheet bus={selectedBus} onClose={() => setSelectedBus(null)} />
      <footer className="footer"><span>© 2026 District Transit</span><span>ระบบติดตามรถโดยสารสาธารณะระดับอำเภอ</span></footer>
    </main>
  );
}