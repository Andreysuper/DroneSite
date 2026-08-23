'use client'

import { useMemo, useState } from 'react'
import { Download, FileText, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/portal/demo-data'
import type { Field, PortalDocument } from '@/lib/portal/types'
import { cn } from '@/lib/utils'

/** File-type accent colours so scanning a long list stays quick. */
const TYPE_TONE: Record<PortalDocument['fileType'], string> = {
  PDF: 'border-destructive/30 bg-destructive/10 text-destructive',
  PNG: 'border-forest/30 bg-forest/10 text-forest',
  CSV: 'border-gold/40 bg-gold/10 text-gold-deep',
  SHP: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',
  ZIP: 'border-border bg-muted text-muted-foreground',
}

type DocumentsBrowserProps = {
  documents: PortalDocument[]
  fields: Field[]
}

export function DocumentsBrowser({ documents, fields }: DocumentsBrowserProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [fieldId, setFieldId] = useState('all')

  const fieldName = (id?: string) =>
    id ? (fields.find((f) => f.id === id)?.name ?? 'Unknown field') : null

  const categories = useMemo(
    () => Array.from(new Set(documents.map((d) => d.category))).sort(),
    [documents],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return documents
      .filter((d) => category === 'all' || d.category === category)
      .filter((d) => fieldId === 'all' || d.fieldId === fieldId)
      .filter((d) => !q || d.name.toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [documents, query, category, fieldId])

  /** Group the filtered results under their category heading. */
  const grouped = useMemo(() => {
    const map = new Map<string, PortalDocument[]>()
    for (const doc of visible) {
      const list = map.get(doc.category) ?? []
      list.push(doc)
      map.set(doc.category, list)
    }
    return Array.from(map.entries())
  }, [visible])

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="doc-search" className="text-xs text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="doc-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by file name"
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 lg:w-52">
          <Label
            htmlFor="doc-category"
            className="text-xs text-muted-foreground"
          >
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="doc-category">
              <SelectValue placeholder="All categories">
                {(value) => (value === 'all' ? 'All categories' : value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 lg:w-52">
          <Label htmlFor="doc-field" className="text-xs text-muted-foreground">
            Field
          </Label>
          <Select value={fieldId} onValueChange={setFieldId}>
            <SelectTrigger id="doc-field">
              <SelectValue placeholder="All fields">
                {(value) =>
                  value === 'all'
                    ? 'All fields'
                    : (fields.find((f) => f.id === value)?.name ?? 'All fields')
                }
              </SelectValue>
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
      </Card>

      <p className="text-sm text-muted-foreground">
        {visible.length} {visible.length === 1 ? 'document' : 'documents'}
      </p>

      {/* Results */}
      {visible.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <FileText className="size-8 text-muted-foreground" aria-hidden />
          <p className="font-semibold">No documents match your filters</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different category or clear your search to see everything in
            your archive.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([cat, docs]) => (
            <section key={cat} className="flex flex-col gap-3">
              <h2 className="font-serif text-lg font-bold">
                {cat}{' '}
                <span className="font-sans text-sm font-normal text-muted-foreground">
                  ({docs.length})
                </span>
              </h2>
              <Card className="overflow-hidden p-0">
                <ul className="divide-y divide-border">
                  {docs.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <FileText className="size-4" aria-hidden />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="truncate text-sm font-semibold">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(doc.date)} · {doc.size}
                          {fieldName(doc.fieldId)
                            ? ` · ${fieldName(doc.fieldId)}`
                            : ''}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn('shrink-0', TYPE_TONE[doc.fileType])}
                      >
                        {doc.fileType}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`Download ${doc.name}`}
                      >
                        <Download className="size-3.5" aria-hidden />
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
