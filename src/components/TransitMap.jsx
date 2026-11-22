import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { busStops, routeGeometry } from "../data/mockTransit.js";

export default function TransitMap({ buses, selectedBus, onSelectBus, activeRoute }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      // แผนที่โทนอ่อน ลดความรกของพื้นหลังเพื่อเน้นรถและเส้นทาง
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [101.1127, 13.3119],
      zoom: 14.2,
      attributionControl: true,
    });

    map.on("load", () => {
      routeGeometry.forEach((route) => {
        map.addSource(`route-${route.id}`, {
          type: "geojson",
          data: { type: "Feature", geometry: { type: "LineString", coordinates: route.coordinates }, properties: {} },
        });
        // เส้นขอบสีขาวช่วยให้เส้นทางเด่นขึ้นโดยไม่กลืนกับถนนบนแผนที่
        map.addLayer({
          id: `route-casing-${route.id}`,
          type: "line",
          source: `route-${route.id}`,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#ffffff", "line-width": 8, "line-opacity": 0.95 },
        });
        map.addLayer({
          id: `route-line-${route.id}`,
          type: "line",
          source: `route-${route.id}`,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": route.color, "line-width": 4.5, "line-opacity": 0.95 },
        });
      });
      setMapLoaded(true);
    });

    map.on("error", () => {
      if (!mapLoaded) setMapError(true);
    });

    mapRef.current = map;
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    routeGeometry.forEach((route) => {
      const visible = activeRoute === "all" || route.id === activeRoute;
      ["route-casing-", "route-line-"].forEach((prefix) => {
        const layerId = `${prefix}${route.id}`;
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
        }
      });
    });
  }, [activeRoute, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    busStops.forEach((stop) => {
      const element = document.createElement("div");
      element.className = "stop-marker-wrap";
      element.title = stop.name;
      element.setAttribute("role", "img");
      element.setAttribute("aria-label", `ป้ายรถโดยสาร ${stop.name}`);
      const dot = document.createElement("span");
      dot.className = "stop-marker";
      const label = document.createElement("span");
      label.className = "stop-marker-label";
      label.textContent = stop.name;
      element.append(dot, label);
      const marker = new maplibregl.Marker({ element, anchor: "center" }).setLngLat(stop.coordinates).addTo(map);
      markersRef.current.push(marker);
    });

    buses.forEach((bus) => {
      const element = document.createElement("button");
      element.className = `bus-map-marker ${selectedBus?.id === bus.id ? "is-selected" : ""}`;
      element.type = "button";
      element.setAttribute("aria-label", `เลือกรถ ${bus.code}`);
      const icon = document.createElement("span");
      icon.className = "marker-bus-icon";
      icon.textContent = "B";
      const code = document.createElement("span");
      code.className = "marker-bus-code";
      code.textContent = bus.code;
      element.append(icon, code);
      element.addEventListener("click", () => onSelectBus(bus));
      const marker = new maplibregl.Marker({ element, anchor: "center" }).setLngLat(bus.coordinates).addTo(map);
      markersRef.current.push(marker);
    });
  }, [buses, selectedBus, onSelectBus, mapLoaded]);

  useEffect(() => {
    if (selectedBus && mapRef.current) {
      mapRef.current.flyTo({ center: selectedBus.coordinates, zoom: 15.2, duration: 700 });
    }
  }, [selectedBus]);

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const locate = () => {
    if (!navigator.geolocation) {
      window.alert("อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => mapRef.current?.flyTo({ center: [coords.longitude, coords.latitude], zoom: 15, duration: 900 }),
      () => window.alert("ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้ กรุณาอนุญาตการใช้ตำแหน่ง")
    );
  };

  return (
    <div className="map-canvas-wrap">
      <div ref={containerRef} className="map-canvas" aria-label="แผนที่รถโดยสารสาธิต อำเภอบ้านบึง จังหวัดชลบุรี" />
      {mapError && <div className="map-error">โหลดแผนที่ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</div>}
      <div className="map-controls" aria-label="เครื่องมือแผนที่">
        <button type="button" onClick={zoomIn} aria-label="ซูมเข้า"><Plus size={19} /></button>
        <button type="button" onClick={zoomOut} aria-label="ซูมออก"><Minus size={19} /></button>
        <span />
        <button type="button" onClick={locate} aria-label="ค้นหาตำแหน่งปัจจุบัน"><LocateFixed size={19} /></button>
      </div>
      <div className="map-demo-stamp">MOCK DATA · บ้านบึง</div>
    </div>
  );
}