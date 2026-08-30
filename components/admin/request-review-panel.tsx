'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  REQUEST_NEXT_STATUSES,
  REQUEST_STATUS_LABEL,
  type RequestStatus,
} from '@/lib/admin/request-status'
import type { StaffOption } from '@/lib/admin/staff-queries'
import {
  assignRequest,
  saveRequestNotes,
  updateRequestStatus,
} from '@/app/admin/requests/actions'

const UNASSIGNED = '__unassigned__'

export function RequestReviewPanel({
  requestId,
  status,
  assignedToId,
  internalNotes,
  quoteAmount,
  staff,
}: {
  requestId: string
  status: RequestStatus
  assignedToId: string | null
  internalNotes: string
  quoteAmount: number | null
  staff: StaffOption[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const nextStatuses = REQUEST_NEXT_STATUSES[status] ?? []
  const [targetStatus, setTargetStatus] = useState<string>('')
  const [note, setNote] = useState('')
  const [customerVisible, setCustomerVisible] = useState(true)

  const [assignee, setAssignee] = useState<string>(assignedToId ?? UNASSIGNED)
  const [notes, setNotes] = useState(internalNotes)
  const [quote, setQuote] = useState<string>(
    quoteAmount !== null ? String(quoteAmount) : '',
  )

  function handleTransition() {
    if (!targetStatus) {
      toast.error('Choose a status to move to.')
      return
    }
    startTransition(async () => {
      const res = await updateRequestStatus(
        requestId,
        targetStatus as RequestStatus,
        note,
        customerVisible,
      )
      if (res.ok) {
        toast.success(
          `Moved to ${REQUEST_STATUS_LABEL[targetStatus as RequestStatus]}.`,
        )
        setNote('')
        setTargetStatus('')
        router.refresh()
      } else {
        toast.error(res.error ?? 'Something went wrong.')
      }
    })
  }

  function handleAssign(value: string) {
    setAssignee(value)
    startTransition(async () => {
      const res = await assignRequest(
        requestId,
        value === UNASSIGNED ? null : value,
      )
      if (res.ok) {
        toast.success('Assignment updated.')
        router.refresh()
      } else {
        toast.error(res.error ?? 'Could not update assignment.')
      }
    })
  }

  function handleSaveNotes() {
    startTransition(async () => {
      const parsedQuote = quote.trim() === '' ? null : Number.parseFloat(quote)
      const res = await saveRequestNotes(requestId, notes, parsedQuote)
      if (res.ok) {
        toast.success('Saved.')
        router.refresh()
      } else {
        toast.error(res.error ?? 'Could not save.')
      }
    })
  }

  const isTerminal = nextStatuses.length === 0

  return (
    <div className="space-y-6">
      {/* Status workflow */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Move request
        </h2>
        {isTerminal ? (
          <p className="text-sm text-muted-foreground">
            This request is {REQUEST_STATUS_LABEL[status].toLowerCase()}. No
            further transitions available.
          </p>
        ) : (
          <div className="space-y-3">
            <Select value={targetStatus} onValueChange={setTargetStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status…">
                  {(value: string) =>
                    value
                      ? REQUEST_STATUS_LABEL[value as RequestStatus]
                      : 'Select new status…'
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {nextStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {REQUEST_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-1.5">
              <Label htmlFor="transition-note">Note (optional)</Label>
              <Textarea
                id="transition-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add context for this change…"
                rows={3}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={customerVisible}
                onCheckedChange={(v) => setCustomerVisible(v === true)}
              />
              Show this update to the customer
            </label>

            <Button
              onClick={handleTransition}
              disabled={pending}
              className="w-full bg-forest text-white hover:bg-forest/90"
            >
              Apply change
            </Button>
          </div>
        )}
      </div>

      {/* Assignment */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Assignee</h2>
        <Select value={assignee} onValueChange={handleAssign}>
          <SelectTrigger>
            <SelectValue placeholder="Unassigned">
              {(value: string) => {
                if (value === UNASSIGNED) return 'Unassigned'
                const match = staff.find((s) => s.id === value)
                return match ? `${match.name} · ${match.roleLabel}` : 'Unassigned'
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
            {staff.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} · {s.roleLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Internal notes + quote */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Internal notes & quote
        </h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="quote">Quote amount (CAD)</Label>
            <Input
              id="quote"
              type="number"
              min="0"
              step="0.01"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="internal-notes">Internal notes (staff only)</Label>
            <Textarea
              id="internal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Private notes about this request…"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleSaveNotes}
            disabled={pending}
            className="w-full"
          >
            Save notes
          </Button>
        </div>
      </div>
    </div>
  )
}
