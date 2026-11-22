import { Clock3, Gauge, MapPin, X } from "lucide-react";

export default function BusDetailSheet({ bus, onClose }) {
  if (!bus) return null;
  return (
    <div className="detail-overlay" role="presentation" onClick={onClose}>
      <section className="bus-detail-sheet" role="dialog" aria-modal="true" aria-labelledby="bus-detail-title" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="detail-heading">
          <div><span className="detail-kicker">รายละเอียดรถโดยสาร · MOCK DATA</span><h2 id="bus-detail-title">{bus.code}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="ปิดรายละเอียด"><X size={19} /></button>
        </div>
        <div className="detail-route"><span className="route-badge">{bus.routeId}</span><strong>{bus.routeName}</strong></div>
        <div className="detail-status"><i className={bus.status === "กำลังให้บริการ" ? "status-dot green" : "status-dot amber"} />{bus.status}<span>ข้อมูลจำลอง</span></div>
        <div className="detail-metrics">
          <div><Gauge size={18} /><span>ความเร็วล่าสุด</span><strong>{bus.speed} <small>กม./ชม.</small></strong></div>
          <div><Clock3 size={18} /><span>เวลาพิกัดล่าสุด</span><strong className="time-value">{bus.lastUpdated}</strong></div>
          <div><MapPin size={18} /><span>ปลายทาง</span><strong>{bus.destination}</strong></div>
        </div>
        <p className="detail-disclaimer">ข้อมูลทั้งหมดในแผงนี้เป็นข้อมูลสาธิต ไม่ได้มาจากอุปกรณ์ GPS หรือรถโดยสารจริง</p>
      </section>
    </div>
  );
}