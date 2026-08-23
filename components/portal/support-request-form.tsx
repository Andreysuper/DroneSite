'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Send } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import type { Field } from '@/lib/portal/types'

const TOPICS = [
  'Scheduling change',
  'Billing question',
  'Report or map issue',
  'Product or rate question',
  'Field access',
  'Something else',
]

const URGENCY = [
  { value: 'low', label: 'Low — whenever you get to it' },
  { value: 'normal', label: 'Normal — within a business day' },
  { value: 'high', label: 'High — in-season, blocking work' },
]

type SupportRequestFormProps = {
  fields: Field[]
}

export function SupportRequestForm({ fields }: SupportRequestFormProps) {
  const [topic, setTopic] = useState('')
  const [fieldId, setFieldId] = useState('none')
  const [urgency, setUrgency] = useState('normal')
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = Boolean(topic && subject.trim() && details.trim())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    // Demo only: no request is sent. Wire this to a server action when the
    // support ticketing backend lands.
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    setSubmitted(true)
    toast.success('Support request submitted', {
      description: 'Our team will follow up in your Messages inbox.',
    })
  }

  if (submitted) {
    return (
      <Card className="flex flex-col items-start gap-3 border-forest/30 bg-forest/5 p-6">
        <span className="flex items-center gap-2 font-semibold text-forest">
          <CheckCircle2 className="size-5" aria-hidden />
          Request received
        </span>
        <p className="text-sm text-muted-foreground">
          Reference{' '}
          <span className="font-mono font-semibold text-foreground">
            SUP-2026-{Math.floor(1000 + Math.random() * 8999)}
          </span>
          . We will reply in your Messages inbox — you will get a notification
          as soon as someone picks it up.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false)
            setTopic('')
            setFieldId('none')
            setUrgency('normal')
            setSubject('')
            setDetails('')
          }}
        >
          Submit another request
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sup-topic">Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="sup-topic">
                <SelectValue placeholder="Choose a topic" />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sup-field">Related field (optional)</Label>
            <Select value={fieldId} onValueChange={setFieldId}>
              <SelectTrigger id="sup-field">
                <SelectValue placeholder="Not field specific" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not field specific</SelectItem>
                {fields.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sup-urgency">Urgency</Label>
          <Select value={urgency} onValueChange={setUrgency}>
            <SelectTrigger id="sup-urgency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {URGENCY.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sup-subject">Subject</Label>
          <Input
            id="sup-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short summary"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sup-details">Details</Label>
          <Textarea
            id="sup-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Tell us what is going on, including dates or invoice references if relevant."
            rows={5}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-fit bg-forest text-primary-foreground hover:bg-forest-deep"
        >
          <Send className="size-4" aria-hidden />
          {submitting ? 'Submitting…' : 'Submit request'}
        </Button>
      </form>
    </Card>
  )
}
