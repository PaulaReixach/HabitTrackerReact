export function dateKeyLocal(date = new Date()) {
  const y = date.getFullYear(); // 2024
  const m = String(date.getMonth() + 1).padStart(2, "0"); // 01 ... 12
  const d = String(date.getDate()).padStart(2, "0"); // 01 ... 31
  return `${y}-${m}-${d}`; // "2024-01-09"
}

export function getYesterdayKey() { 
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKeyLocal(d);
}


export function mondayIndex(jsDay) {
  // jsDay: 0 domingo ... 6 sábado  -> queremos lunes=0 ... domingo=6
  return (jsDay + 6) % 7; //
}