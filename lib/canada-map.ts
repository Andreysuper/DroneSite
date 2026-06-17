import fs from 'node:fs'
import path from 'node:path'
import { geoMercator, geoPath } from 'd3-geo'

export type ProvincePath = {
  name: string
  d: string
}

export type CanadaMap = {
  width: number
  height: number
  provinces: ProvincePath[]
}

const WIDTH = 900
const HEIGHT = 720

// Generates projected SVG path strings on the server so the large GeoJSON
// (~700KB) never ships to the browser — only compact path data does.
export function getCanadaMap(): CanadaMap {
  const file = path.join(process.cwd(), 'public', 'geo', 'canada.geojson')
  const geojson = JSON.parse(fs.readFileSync(file, 'utf8'))

  const projection = geoMercator().fitExtent(
    [
      [20, 20],
      [WIDTH - 20, HEIGHT - 20],
    ],
    geojson,
  )
  const pathGen = geoPath(projection)

  const provinces: ProvincePath[] = geojson.features.map(
    (feature: { properties: { name: string } }) => ({
      name: feature.properties.name,
      d: pathGen(feature as never) ?? '',
    }),
  )

  return { width: WIDTH, height: HEIGHT, provinces }
}
