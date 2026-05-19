'use client'

import { useEffect, useState } from 'react'

interface FeedbackItem {
  id: string
  course_id: string
  name: string
  message: string
  created_at: string
}

const NAME_KEY = 'invpackages_sme_name'

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  if (Number.isNaN(diff)) return ''
  const m = Math.round(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function CourseFeedback({ courseId, courseTitle }: { courseId: string; courseTitle: string }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY)
      if (saved) setName(saved)
    } catch {}
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/feedback?courseId=${encodeURIComponent(courseId)}`, { cache: 'no-store' })
        const data = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setError(data.error ?? 'Failed to load feedback')
          setItems([])
        } else {
          setItems((data.feedback ?? []) as FeedbackItem[])
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message)
          setItems([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [courseId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedMessage = message.trim()
    if (!trimmedName || !trimmedMessage) return

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ courseId, name: trimmedName, message: trimmedMessage }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to post feedback')

      setItems((prev) => [data.feedback as FeedbackItem, ...prev])
      setMessage('')
      try { localStorage.setItem(NAME_KEY, trimmedName) } catch {}
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(item: FeedbackItem) {
    setEditingId(item.id)
    setEditDraft(item.message)
    setEditError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDraft('')
    setEditError(null)
  }

  async function saveEdit() {
    if (!editingId) return
    const trimmed = editDraft.trim()
    if (!trimmed) { setEditError('Message cannot be empty'); return }

    setEditSaving(true)
    setEditError(null)
    try {
      const res = await fetch(`/api/feedback/${encodeURIComponent(editingId)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to update feedback')

      setItems((prev) => prev.map((it) => (it.id === editingId ? (data.feedback as FeedbackItem) : it)))
      cancelEdit()
    } catch (e) {
      setEditError((e as Error).message)
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(item: FeedbackItem) {
    if (!confirm(`Delete this feedback from ${item.name}?`)) return
    setDeletingId(item.id)
    try {
      const res = await fetch(`/api/feedback/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to delete feedback')
      }
      setItems((prev) => prev.filter((it) => it.id !== item.id))
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-white p-6 space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          Feedback
          {items.length > 0 && (
            <span className="ml-2 text-ink3 text-sm font-normal">({items.length})</span>
          )}
        </h2>
        <p className="text-xs text-ink3 font-mono uppercase tracking-widest">
          {courseTitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 border-b border-border pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-2">
          <input
            type="text"
            placeholder="Your name or email"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
          <textarea
            placeholder="Share your feedback on this course's packages, features, or pricing…"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20 resize-y"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink3">
            Visible to everyone on this page.
          </p>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="px-5 py-2 bg-ink text-white text-sm font-medium rounded-lg hover:bg-ink2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting…' : 'Submit feedback'}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </form>

      {loading ? (
        <p className="text-sm text-ink3">Loading feedback…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink3 italic">No feedback yet. Be the first to share.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const isEditing = editingId === item.id
            const isDeleting = deletingId === item.id
            return (
              <li key={item.id} className="group border-l-2 border-border pl-4">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="text-sm font-medium text-ink">{item.name}</span>
                  <span className="text-xs text-ink3 font-mono">{formatRelative(item.created_at)}</span>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={3}
                      autoFocus
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-ink/20 resize-y"
                    />
                    {editError && <p className="text-xs text-red-600">{editError}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={editSaving || !editDraft.trim()}
                        className="px-3 py-1 bg-ink text-white text-xs font-medium rounded-lg hover:bg-ink2 transition-colors disabled:opacity-50"
                      >
                        {editSaving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={editSaving}
                        className="px-3 py-1 border border-border text-ink2 text-xs rounded-lg hover:bg-paper transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-ink2 leading-relaxed whitespace-pre-wrap">{item.message}</p>
                    <div className="mt-1 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="text-xs text-ink3 hover:text-ink"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isDeleting}
                        className="text-xs text-ink3 hover:text-red-500 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
