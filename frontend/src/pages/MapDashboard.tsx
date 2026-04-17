import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import bandungGeoJSON from "@/data/3273-kota-bandung-level-kecamatan.json";

// koordinat tengah Kota Bandung
const position: LatLngTuple = [-6.9147, 107.6098];

// batas wilayah Kota Bandung agar user gabisa scroll jauh dari Kota Bandung
const bandungBounds: LatLngBoundsExpression = [
  [-6.9833, 107.5458], // Barat Daya
  [-6.834, 107.7388], // Timur Laut
];

export default function MapDashboard() {
  const styleKecamatan = (feature: any) => {
    const kecamatanName = feature?.properties?.WADMKC;
    const fillColor =
      kecamatanName && kecamatanName.length > 8 ? "#3b82f6" : "#93c5fd";

    return {
      fillColor: fillColor,
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  const onEachKecamatan = (feature: any, layer: any) => {
    // TODO: DELETE
    console.log("Properti GeoJSON: ", feature.properties);

    const kecamatanName = feature.properties.nama_kecamatan;

    layer.bindTooltip(
      `<strong>${kecamatanName || "Tidak Diketahui"}</strong><br/>0 Laporan`,
      {
        direction: "top",
        sticky: true,
      },
    );

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.9,
          weight: 2,
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 1,
        });
      },
    });
  };

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={position}
        zoom={13}
        minZoom={12}
        maxBounds={bandungBounds}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }} // full map ngikutin parent
        className="z-0"
      >
        <TileLayer
          attribution="&copy; CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          data={bandungGeoJSON as any}
          style={styleKecamatan}
          onEachFeature={onEachKecamatan}
        />
      </MapContainer>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-lg shadow-xl hover:bg-zinc-800 transition-all text-sm font-medium">
          + Buat Laporan
        </button>
      </div>
    </div>
  );
}
