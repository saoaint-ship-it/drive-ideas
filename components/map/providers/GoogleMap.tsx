"use client";

import { useEffect } from "react";
import {
  APIProvider,
  Map as GMap,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  type CourseMapProps,
  ROUTE_COLOR,
  ROUTE_WIDTH,
  pathBounds,
} from "@/components/map/types";

// Google Maps JavaScript API 版。
// ダークテーマは Map ID (クラウド側で設定したカスタムスタイル) で適用する

function RoutePolyline({ path }: { path: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path) return;
    const line = new google.maps.Polyline({
      path: path.map(([lng, lat]) => ({ lat, lng })),
      strokeColor: ROUTE_COLOR,
      strokeWeight: ROUTE_WIDTH,
      strokeOpacity: 1,
    });
    line.setMap(map);
    return () => line.setMap(null);
  }, [map, path]);

  return null;
}

function FitToPath({ path }: { path: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length < 2) return;
    const [[minLng, minLat], [maxLng, maxLat]] = pathBounds(path);
    map.fitBounds(
      new google.maps.LatLngBounds(
        { lat: minLat, lng: minLng },
        { lat: maxLat, lng: maxLng }
      ),
      60
    );
  }, [map, path]);

  return null;
}

export default function GoogleMap({
  center,
  path,
  markers,
  zoom = 10,
  onMarkerClick,
  fitToPath = false,
}: CourseMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  // Map ID未設定(空文字)の場合はテスト用IDにフォールバックする
  // （AdvancedMarkerは有効なMap IDがないと使えないため）
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

  return (
    <APIProvider apiKey={apiKey}>
      <GMap
        mapId={mapId}
        defaultCenter={center}
        defaultZoom={zoom}
        colorScheme="LIGHT"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        {path && <RoutePolyline path={path} />}
        {fitToPath && path && <FitToPath path={path} />}

        {markers?.map((m) => (
          <AdvancedMarker
            key={`${m.name}-${m.lat}`}
            position={{ lat: m.lat, lng: m.lng }}
            title={m.name}
            onClick={() => onMarkerClick?.(m.name)}
          >
            <div
              aria-label={`${m.type}: ${m.name}`}
              className="h-3 w-3 border border-white bg-text shadow-sm"
            />
          </AdvancedMarker>
        ))}
      </GMap>
    </APIProvider>
  );
}
