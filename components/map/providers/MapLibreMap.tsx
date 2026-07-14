"use client";

import { useMemo } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  type CourseMapProps,
  ROUTE_COLOR,
  ROUTE_WIDTH,
  pathBounds,
} from "@/components/map/types";

// APIキー不要のフォールバック実装。
// ベースマップは CARTO Positron（モダンな淡グレー基調）。サイトの白基調に合わせ、
// わずかに彩度を落として赤いルートラインが主役になるようにする
const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#fafaf8" },
    },
    {
      id: "carto-light",
      type: "raster",
      source: "carto",
      paint: {
        "raster-saturation": -0.3,
      },
    },
  ],
};

export default function MapLibreMap({
  center,
  path,
  markers,
  zoom = 10,
  onMarkerClick,
  fitToPath = false,
}: CourseMapProps) {
  const initialViewState = useMemo(() => {
    if (fitToPath && path && path.length > 1) {
      return {
        bounds: pathBounds(path),
        fitBoundsOptions: { padding: 60 },
      };
    }
    return { longitude: center.lng, latitude: center.lat, zoom };
  }, [center, path, zoom, fitToPath]);

  const routeGeoJson = useMemo(
    () =>
      path
        ? {
            type: "Feature" as const,
            properties: {},
            geometry: { type: "LineString" as const, coordinates: path },
          }
        : null,
    [path]
  );

  return (
    <Map
      initialViewState={initialViewState}
      mapStyle={mapStyle}
      style={{ width: "100%", height: "100%" }}
      attributionControl={{ compact: false }}
    >
      {routeGeoJson && (
        <Source id="route" type="geojson" data={routeGeoJson}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": ROUTE_COLOR,
              "line-width": ROUTE_WIDTH,
            }}
            layout={{ "line-cap": "round", "line-join": "round" }}
          />
        </Source>
      )}

      {markers?.map((m) => (
        <Marker
          key={`${m.name}-${m.lat}`}
          longitude={m.lng}
          latitude={m.lat}
          anchor="center"
        >
          <button
            type="button"
            aria-label={`${m.type}: ${m.name}`}
            title={m.name}
            onClick={() => onMarkerClick?.(m.name)}
            className="block h-3 w-3 border border-white bg-text shadow-sm transition-transform hover:scale-125"
          />
        </Marker>
      ))}
    </Map>
  );
}
