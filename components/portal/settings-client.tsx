'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Building2, CreditCard, LogOut, Save, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Organization, PortalUser } from '@/lib/portal/types'

const NOTIFICATION_ROWS: {
  key: keyof PortalUser['notificationPreferences']
  label: string
  description: string
}[] = [
  {
    key: 'email',
    label: 'Email notifications',
    description: 'Everything below is delivered to your email address.',
  },
  {
    key: 'sms',
    label: 'SMS notifications',
    description: 'Text alerts for time-sensitive flight changes.',
  },
  {
    key: 'serviceReminders',
    label: 'Service reminders',
    description: 'A heads up the day before a scheduled application.',
  },
  {
    key: 'invoiceNotifications',
    label: 'Invoice notifications',
    description: 'When a new invoice is issued or a payment is received.',
  },
  {
    key: 'reportReady',
    label: 'Report ready alerts',
    description: 'When new maps or analysis finish processing.',
  },
]

type SettingsClientProps = {
  user: PortalUser
  organizations: Organization[]
}

export function SettingsClient({ user, organizations }: SettingsClientProps) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company,
    billingAddress: user.billingAddress,
  })
  const [prefs, setPrefs] = useState(user.notificationPreferences)
  const [saving, setSaving] = useState(false)

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // Demo only: replace with a server action once accounts are persisted.
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    toast.success('Profile updated')
  }

  function togglePref(key: keyof typeof prefs, value: boolean) {
    setPrefs((prev) => ({ ...prev, [key]: value }))
    toast.success(value ? 'Notification enabled' : 'Notification disabled')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <Card className="p-5">
        <form onSubmit={saveProfile} className="flex flex-col gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Used on invoices, application records and flight briefs.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="set-name">Full name</Label>
              <Input
                id="set-name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="set-company">Company</Label>
              <Input
                id="set-company"
                value={profile.company}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="set-email">Email</Label>
              <Input
                id="set-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="set-phone">Phone</Label>
              <Input
                id="set-phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="set-address">Billing address</Label>
            <Textarea
              id="set-address"
              rows={2}
              value={profile.billingAddress}
              onChange={(e) =>
                setProfile({ ...profile, billingAddress: e.target.value })
              }
            />
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="w-fit bg-forest text-primary-foreground hover:bg-forest-deep"
          >
            <Save className="size-4" aria-hidden />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card className="flex flex-col gap-4 p-5">
        <div>
          <h2 className="font-serif text-xl font-bold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Choose what reaches you and how.
          </p>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {NOTIFICATION_ROWS.map((row) => (
            <li
              key={row.key}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor={`pref-${row.key}`}
                  className="cursor-pointer font-semibold"
                >
                  {row.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {row.description}
                </p>
              </div>
              <Switch
                id={`pref-${row.key}`}
                checked={prefs[row.key]}
                onCheckedChange={(v) => togglePref(row.key, Boolean(v))}
              />
            </li>
          ))}
        </ul>
      </Card>

      {/* Organizations */}
      <Card className="flex flex-col gap-4 p-5">
        <div>
          <h2 className="font-serif text-xl font-bold">Organizations</h2>
          <p className="text-sm text-muted-foreground">
            Accounts you can switch between from the top bar.
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {organizations.map((org) => (
            <li
              key={org.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest">
                  <Building2 className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold leading-tight">{org.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {org.location}
                  </p>
                </div>
              </div>
              {org.id === user.defaultOrganizationId ? (
                <Badge
                  variant="outline"
                  className="border-forest/30 bg-forest/10 text-forest"
                >
                  Default
                </Badge>
              ) : (
                <Button size="sm" variant="outline">
                  Make default
                </Button>
              )}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Need to add a team member or another farm? Message the operations
          team and we will set it up within one business day.
        </p>
      </Card>

      {/* Security & billing */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-3 p-5">
          <span className="flex items-center gap-2 font-serif text-lg font-bold">
            <ShieldCheck className="size-4 text-forest" aria-hidden />
            Security
          </span>
          <p className="text-sm text-muted-foreground">
            Your account is protected with a password. Two-factor
            authentication is coming to the portal shortly.
          </p>
          <Separator />
          <Button variant="outline" className="w-fit">
            Change password
          </Button>
          <Button
            variant="ghost"
            className="w-fit text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out of all devices
          </Button>
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <span className="flex items-center gap-2 font-serif text-lg font-bold">
            <CreditCard className="size-4 text-forest" aria-hidden />
            Payment method
          </span>
          <div className="rounded-lg border border-border p-3">
            <p className="font-semibold">EFT — RBC ••4821</p>
            <p className="text-xs text-muted-foreground">
              Default for all invoices
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Invoices are drawn 14 days after issue unless you pay earlier.
          </p>
          <Button variant="outline" className="mt-auto w-fit">
            Update payment method
          </Button>
        </Card>
      </div>
    </div>
  )
}
