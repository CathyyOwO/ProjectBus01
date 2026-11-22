import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { busStops, routeGeometry } from "../data/mockTransit.js";

export default function TransitMap({ buses, selectedBus, onSelectBus, activeRoute }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [100.511, 13.756],
      zoom: 12.6,
      attributionControl: true,
    });

    map.on("load", () => {
      routeGeometry.forEach((route) => {
        map.addSource(`route-${route.id}`, {
          type: "geojson",
          data: { type: "Feature", geometry: { type: "LineString", coordinates: route.coordinates }, properties: {} },
        });
        map.addLayer({
          id: `route-line-${route.id}`,
          type: "line",
          source: `route-${route.id}`,
          paint: { "line-color": route.color, "line-width": 4, "line-opacity": 0.82 },
        });
      });
      setMapLoaded(true);
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
      if (map.getLayer(`route-line-${route.id}`)) {
        map.setLayoutProperty(`route-line-${route.id}`, "visibility", visible ? "visible" : "none");
      }
    });
  }, [activeRoute, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    busStops.forEach((stop) => {
      const element = document.createElement("div");
      element.className = "stop-marker";
      element.title = stop.name;
      element.setAttribute("role", "img");
      element.setAttribute("aria-label", `ป้ายรถโดยสาร ${stop.name}`);
      const marker = new maplibregl.Marker({ element, anchor: "center" }).setLngLat(stop.coordinates).addTo(map);
      markersRef.current.push(marker);
    });

    buses.forEach((bus) => {
      const element = document.createElement("button");
      element.className = `bus-map-marker ${selectedBus?.id === bus.id ? "is-selected" : ""}`;
      element.type = "button";
      element.setAttribute("aria-label", `เลือกรถ ${bus.code}`);
      element.innerHTML = '<span class="marker-bus-icon">B</span>';
      element.addEventListener("click", () => onSelectBus(bus));
      const marker = new maplibregl.Marker({ element, anchor: "center" }).setLngLat(bus.coordinates).addTo(map);
      markersRef.current.push(marker);
    });
  }, [buses, selectedBus, onSelectBus, mapLoaded]);

  useEffect(() => {
    if (selectedBus && mapRef.current) {
      mapRef.current.flyTo({ center: selectedBus.coordinates, zoom: 14, duration: 700 });
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
      <div ref={containerRef} className="map-canvas" aria-label="แผนที่รถโดยสารสาธิต" />
      <div className="map-controls" aria-label="เครื่องมือแผนที่">
        <button type="button" onClick={zoomIn} aria-label="ซูมเข้า"><Plus size={19} /></button>
        <button type="button" onClick={zoomOut} aria-label="ซูมออก"><Minus size={19} /></button>
        <span />
        <button type="button" onClick={locate} aria-label="ค้นหาตำแหน่งปัจจุบัน"><LocateFixed size={19} /></button>
      </div>
      <div className="map-demo-stamp">DEMO MAP</div>
    </div>
  );
}