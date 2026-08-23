'use client'

import { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { MessageThread } from '@/lib/portal/types'
import { cn } from '@/lib/utils'

type MessagesClientProps = {
  threads: MessageThread[]
}

export function MessagesClient({ threads }: MessagesClientProps) {
  const sorted = [...threads].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )
  const [activeId, setActiveId] = useState<string | null>(
    sorted[0]?.id ?? null,
  )
  /** Locally appended replies, keyed by thread — demo only, not persisted. */
  const [drafts, setDrafts] = useState<Record<string, string[]>>({})
  const [input, setInput] = useState('')
  const [readIds, setReadIds] = useState<string[]>([])

  const active = sorted.find((t) => t.id === activeId) ?? null

  function openThread(id: string) {
    setActiveId(id)
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setInput('')
  }

  function send() {
    const body = input.trim()
    if (!body || !active) return
    setDrafts((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), body],
    }))
    setInput('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
      {/* Thread list */}
      <Card
        className={cn(
          'overflow-hidden p-0',
          active && 'hidden lg:block',
        )}
      >
        <ul className="divide-y divide-border">
          {sorted.map((thread) => {
            const isUnread = thread.unread && !readIds.includes(thread.id)
            const last = thread.messages[thread.messages.length - 1]
            return (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => openThread(thread.id)}
                  aria-current={activeId === thread.id ? 'true' : undefined}
                  className={cn(
                    'flex w-full flex-col gap-1 p-3 text-left transition-colors hover:bg-muted/60',
                    activeId === thread.id && 'bg-forest/10',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        'text-sm leading-tight',
                        isUnread ? 'font-bold' : 'font-semibold',
                      )}
                    >
                      {thread.subject}
                    </span>
                    {isUnread && (
                      <span
                        className="mt-1 size-2 shrink-0 rounded-full bg-gold"
                        aria-label="Unread"
                      />
                    )}
                  </div>
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {last?.body}
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground">
                    {thread.updatedAt}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Conversation */}
      {active ? (
        <Card className="flex min-h-[28rem] flex-col p-0">
          <header className="flex items-center gap-3 border-b border-border p-4">
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setActiveId(null)}
              aria-label="Back to conversations"
            >
              <ArrowLeft className="size-4" aria-hidden />
            </Button>
            <div>
              <h2 className="font-serif text-lg font-bold leading-tight">
                {active.subject}
              </h2>
              <p className="text-xs text-muted-foreground">
                With AgroSkyTech Operations
              </p>
            </div>
          </header>

          <ol className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {active.messages.map((m) => (
              <li
                key={m.id}
                className={cn(
                  'flex flex-col gap-1',
                  m.from === 'client' ? 'items-end' : 'items-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                    m.from === 'client'
                      ? 'rounded-br-sm bg-forest text-primary-foreground'
                      : 'rounded-bl-sm bg-muted text-foreground',
                  )}
                >
                  {m.body}
                </div>
                <span className="text-[0.7rem] text-muted-foreground">
                  {m.author} · {m.sentAt}
                </span>
              </li>
            ))}
            {(drafts[active.id] ?? []).map((body, i) => (
              <li key={`draft-${i}`} className="flex flex-col items-end gap-1">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-forest px-4 py-2.5 text-sm text-primary-foreground">
                  {body}
                </div>
                <span className="text-[0.7rem] text-muted-foreground">
                  You · Sending…
                </span>
              </li>
            ))}
          </ol>

          <div className="flex items-end gap-2 border-t border-border p-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                ) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Write a reply…"
              aria-label="Reply message"
              rows={2}
              className="min-h-0 resize-none"
            />
            <Button
              onClick={send}
              disabled={!input.trim()}
              aria-label="Send reply"
              className="bg-forest text-primary-foreground hover:bg-forest-deep"
            >
              <Send className="size-4" aria-hidden />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="hidden items-center justify-center p-12 text-center lg:flex">
          <p className="text-sm text-muted-foreground">
            Select a conversation to read it.
          </p>
        </Card>
      )}
    </div>
  )
}
