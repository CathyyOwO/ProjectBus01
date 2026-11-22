// ข้อมูลจำลองสำหรับหน้า Passenger — พื้นที่ตัวอย่าง: อำเภอบ้านบึง จ.ชลบุรี
// พิกัดรถและเส้นทางเป็นข้อมูลสาธิต ไม่ใช่เส้นทางหรือ GPS ของผู้ให้บริการจริง

export const routes = [
  { id: "R1", shortName: "สาย 01", name: "ตลาดบ้านบึง - โรงพยาบาลบ้านบึง", color: "#2563eb" },
  { id: "R2", shortName: "สาย 02", name: "เทศบาล - ตลาดบ้านบึง", color: "#e08a28" },
];

export const buses = [
  {
    id: "demo-bus-01",
    code: "DT-001",
    routeId: "R1",
    routeName: "สาย 01 · ตลาดบ้านบึง - โรงพยาบาลบ้านบึง",
    destination: "โรงพยาบาลบ้านบึง",
    status: "กำลังให้บริการ",
    speed: 32,
    lastUpdated: "13:42 น. (ข้อมูลตัวอย่าง)",
    coordinates: [101.1112, 13.3128],
  },
  {
    id: "demo-bus-02",
    code: "DT-002",
    routeId: "R1",
    routeName: "สาย 01 · ตลาดบ้านบึง - โรงพยาบาลบ้านบึง",
    destination: "ตลาดบ้านบึง",
    status: "กำลังให้บริการ",
    speed: 24,
    lastUpdated: "13:39 น. (ข้อมูลตัวอย่าง)",
    coordinates: [101.1087, 13.3151],
  },
  {
    id: "demo-bus-03",
    code: "DT-003",
    routeId: "R2",
    routeName: "สาย 02 · เทศบาล - ตลาดบ้านบึง",
    destination: "ตลาดบ้านบึง",
    status: "จอดพัก",
    speed: 0,
    lastUpdated: "13:35 น. (ข้อมูลตัวอย่าง)",
    coordinates: [101.1152, 13.3098],
  },
];

export const busStops = [
  { id: "stop-01", name: "ตลาดบ้านบึง · จุดจอดจำลอง", coordinates: [101.1142, 13.3104] },
  { id: "stop-02", name: "โรงพยาบาลบ้านบึง · จุดอ้างอิง", coordinates: [101.10936, 13.31636] },
  { id: "stop-03", name: "จุดจอดจำลอง 03", coordinates: [101.1182, 13.3132] },
  { id: "stop-04", name: "จุดจอดจำลอง 04", coordinates: [101.1072, 13.3089] },
];

export const routeGeometry = [
  {
    id: "R1",
    color: "#2563eb",
    coordinates: [
      [101.1142, 13.3104],
      [101.1125, 13.3120],
      [101.1112, 13.3128],
      [101.10936, 13.31636],
    ],
  },
  {
    id: "R2",
    color: "#e08a28",
    coordinates: [
      [101.1072, 13.3089],
      [101.1110, 13.3096],
      [101.1152, 13.3098],
      [101.1182, 13.3132],
    ],
  },
];