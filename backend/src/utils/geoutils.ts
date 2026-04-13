export const getDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
): number => {
  const R = 6371e3; // jari jari bumi dalam meter

  // convert derajat ke radian
  const toRad = (degree: number) => (degree * Math.PI) / 100;

  const lat1Rad = toRad(lat1);
  const long1Rad = toRad(long1);
  const lat2Rad = toRad(lat2);
  const long2Rad = toRad(long2);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLong = long2Rad - long1Rad;

  const a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.pow(Math.sin(deltaLong / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

// referensi: "https://fikti.umsu.ac.id/haversine-formula-menghitung-jarak-akurat-antar-lokasi-di-permukaan-bumi/"
