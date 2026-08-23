'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Download,
  Layers,
  MapPin,
  Ruler,
  Share2,
  Sparkles,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldMapView } from '@/components/portal/field-map'
import { formatDate } from '@/lib/portal/demo-data'
import type { Field, FieldMap, MapVariant } from '@/lib/portal/types'
import { cn } from '@/lib/utils'

const LAYERS: { variant: MapVariant; label: string }[] = [
  { variant: 'rgb', label: 'True colour' },
  { variant: 'ndvi', label: 'NDVI' },
  { variant: 'health', label: 'Crop health' },
  { variant: 'coverage', label: 'Spray coverage' },
  { variant: 'treatment', label: 'Prescription' },
  { variant: 'problem', label: 'Problem zones' },
]

const ANALYSIS_TONE: Record<FieldMap['analysisStatus'], string> = {
  complete: 'border-forest/30 bg-forest/10 text-forest',
  processing: 'border-gold/40 bg-gold/10 text-gold-deep',
  queued: 'border-border bg-muted text-muted-foreground',
}

type MapsGalleryProps = {
  maps: FieldMap[]
  fields: Field[]
  initialFieldId?: string
}

export function MapsGallery({
  maps,
  fields,
  initialFieldId,
}: MapsGalleryProps) {
  const [fieldId, setFieldId] = useState(initialFieldId ?? 'all')
  const [reportType, setReportType] = useState('all')
  const [active, setActive] = useState<FieldMap | null>(null)
  const [layer, setLayer] = useState<MapVariant | null>(null)

  const fieldName = (id: string) =>
    fields.find((f) => f.id === id)?.name ?? 'Unknown field'

  const reportTypes = useMemo(
    () => Array.from(new Set(maps.map((m) => m.type))).sort(),
    [maps],
  )

  const visible = useMemo(
    () =>
      maps
        .filter((m) => fieldId === 'all' || m.fieldId === fieldId)
        .filter((m) => reportType === 'all' || m.type === reportType)
        .sort((a, b) => b.capturedDate.localeCompare(a.capturedDate)),
    [maps, fieldId, reportType],
  )

  function openViewer(map: FieldMap) {
    setActive(map)
    setLayer(map.image)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="map-field" className="text-xs text-muted-foreground">
            Field
          </Label>
          <Select value={fieldId} onValueChange={setFieldId}>
            <SelectTrigger id="map-field">
              <SelectValue placeholder="All fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fields</SelectItem>
              {fields.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="map-type" className="text-xs text-muted-foreground">
            Report type
          </Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="map-type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {reportTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground sm:pb-2.5">
          {visible.length} {visible.length === 1 ? 'map' : 'maps'}
        </p>
      </Card>

      {/* Gallery */}
      {visible.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <Layers className="size-8 text-muted-foreground" aria-hidden />
          <p className="font-semibold">No maps match these filters</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try widening your selection, or book a mapping flight to generate
            new imagery for this field.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/portal/book">Book a mapping flight</Link>}
          />
        </Card>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((map) => (
            <li key={map.id}>
              <Card className="group flex h-full flex-col overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => openViewer(map)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-muted text-left"
                  aria-label={`Open ${map.type} for ${fieldName(map.fieldId)}`}
                >
                  <FieldMapView
                    variant={map.image}
                    seed={map.id}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-forest-deep/85 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-cream backdrop-blur">
                    {map.type}
                  </span>
                </button>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold leading-tight">
                        {fieldName(map.fieldId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(map.capturedDate)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'shrink-0 capitalize',
                        ANALYSIS_TONE[map.analysisStatus],
                      )}
                    >
                      {map.analysisStatus}
                    </Badge>
                  </div>
                  <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Ruler className="size-3" aria-hidden />
                      <dt className="sr-only">Resolution</dt>
                      <dd>{map.resolution}</dd>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="size-3" aria-hidden />
                      <dt className="sr-only">File size</dt>
                      <dd>{map.fileSize}</dd>
                    </div>
                  </dl>
                  <p className="text-xs text-muted-foreground">{map.mission}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openViewer(map)}
                    >
                      <Layers className="size-3.5" aria-hidden />
                      View layers
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      nativeButton={false}
                      render={
                        <Link href={`/portal/fields/${map.fieldId}`}>
                          <MapPin className="size-3.5" aria-hidden />
                          Field
                        </Link>
                      }
                    />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {/* Layer viewer */}
      {active && layer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.type} viewer`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <Card
            className="flex max-h-[90vh] w-full max-w-4xl flex-col gap-0 overflow-hidden p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-border p-4">
              <div>
                <h2 className="font-serif text-xl font-bold">
                  {fieldName(active.fieldId)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {active.type} · {formatDate(active.capturedDate)} ·{' '}
                  {active.resolution}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setActive(null)}
                aria-label="Close viewer"
              >
                <X className="size-4" aria-hidden />
              </Button>
            </header>

            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted">
              <FieldMapView variant={layer} seed={active.id} showDecorations />
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Analysis layers
                </p>
                <div className="flex flex-wrap gap-2">
                  {LAYERS.map((l) => (
                    <Button
                      key={l.variant}
                      size="sm"
                      variant={layer === l.variant ? 'default' : 'outline'}
                      onClick={() => setLayer(l.variant)}
                      aria-pressed={layer === l.variant}
                      className={cn(
                        layer === l.variant &&
                          'bg-forest text-primary-foreground hover:bg-forest-deep',
                      )}
                    >
                      {l.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <Button className="bg-forest text-primary-foreground hover:bg-forest-deep">
                  <Download className="size-4" aria-hidden />
                  Download GeoTIFF ({active.fileSize})
                </Button>
                <Button variant="outline">
                  <Sparkles className="size-4" aria-hidden />
                  Request agronomy review
                </Button>
                <Button variant="outline">
                  <Share2 className="size-4" aria-hidden />
                  Share with agronomist
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
