export const routes = [
  { id: "R1", shortName: "สาย 01", name: "ตลาด - สถานีขนส่ง", color: "#2563eb" },
  { id: "R2", shortName: "สาย 02", name: "โรงพยาบาล - ตลาด", color: "#0f9f83" },
];

export const buses = [
  {
    id: "demo-bus-01",
    code: "DT-001",
    routeId: "R1",
    routeName: "สาย 01 · ตลาด - สถานีขนส่ง",
    destination: "สถานีขนส่ง",
    status: "กำลังให้บริการ",
    speed: 32,
    lastUpdated: "13:42 น. (ข้อมูลตัวอย่าง)",
    coordinates: [100.5231, 13.7448],
  },
  {
    id: "demo-bus-02",
    code: "DT-002",
    routeId: "R1",
    routeName: "สาย 01 · ตลาด - สถานีขนส่ง",
    destination: "ตลาด",
    status: "กำลังให้บริการ",
    speed: 24,
    lastUpdated: "13:39 น. (ข้อมูลตัวอย่าง)",
    coordinates: [100.5052, 13.7622],
  },
  {
    id: "demo-bus-03",
    code: "DT-003",
    routeId: "R2",
    routeName: "สาย 02 · โรงพยาบาล - ตลาด",
    destination: "ตลาด",
    status: "จอดพัก",
    speed: 0,
    lastUpdated: "13:35 น. (ข้อมูลตัวอย่าง)",
    coordinates: [100.4928, 13.7514],
  },
];

export const busStops = [
  { id: "stop-01", name: "ตลาดกลาง", coordinates: [100.5128, 13.7548] },
  { id: "stop-02", name: "โรงพยาบาล", coordinates: [100.4908, 13.7468] },
  { id: "stop-03", name: "สถานีขนส่ง", coordinates: [100.5318, 13.7658] },
  { id: "stop-04", name: "ที่ว่าการอำเภอ", coordinates: [100.5058, 13.7728] },
];

export const routeGeometry = [
  {
    id: "R1",
    color: "#2563eb",
    coordinates: [[100.4908, 13.7468], [100.501, 13.750], [100.5128, 13.7548], [100.5231, 13.760], [100.5318, 13.7658]],
  },
  {
    id: "R2",
    color: "#0f9f83",
    coordinates: [[100.4908, 13.7468], [100.497, 13.750], [100.5058, 13.7728], [100.5128, 13.7548]],
  },
];