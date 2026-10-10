/**
 * Shared category filter used by all three portfolio subsections.
 *
 * Shown even when a section is still empty, so the category structure is
 * visible from the start and a project added later immediately has a home.
 */

interface CategoryFilterProps {
  categories: string[]
  value: string
  onChange: (category: string) => void
  /** Accessible name, e.g. "Video Editing categories". */
  label: string
  /** Project counts per category, used to mark which ones have work. */
  counts: Map<string, number>
}

export function CategoryFilter({
  categories,
  value,
  onChange,
  label,
  counts,
}: CategoryFilterProps) {
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0)

  return (
    <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label={label}>
      <Chip active={value === 'All'} onClick={() => onChange('All')} count={total}>
        All
      </Chip>

      {categories.map((category) => (
        <Chip
          key={category}
          active={value === category}
          onClick={() => onChange(category)}
          count={counts.get(category) ?? 0}
        >
          {category}
        </Chip>
      ))}
    </div>
  )
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-purple bg-purple/10 text-purple-soft'
          : 'border-line text-muted hover:border-line-strong hover:text-ink'
      }`}
    >
      {children}
      {count > 0 && (
        <span className={active ? 'text-purple-soft/70' : 'text-muted/60'}>{count}</span>
      )}
    </button>
  )
}
