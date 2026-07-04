const PALETTE: [string, string][] = [
  ['#b45309', '#1c1917'],
  ['#334155', '#0f172a'],
  ['#7e22ce', '#1e1b4b'],
  ['#0e7490', '#083344'],
  ['#7c2d12', '#1c1917'],
  ['#db2777', '#4c1d95'],
  ['#0891b2', '#3b0764'],
  ['#3f6212', '#1a2e05'],
  ['#7c3aed', '#0c4a6e'],
  ['#a16207', '#1c1917'],
]

export function gradientFor(id: number): [string, string] {
  return PALETTE[Math.abs(id) % PALETTE.length]
}

export function letterFor(title: string): string {
  return title.trim().charAt(0).toUpperCase() || '?'
}
