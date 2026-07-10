// Navigation keys.
// Slidev's defaults already map Space and → (Right) to "advance one step"
// (click-by-click). By default Down/Up jump whole slides instead — this remaps
// them to advance/retreat one step too, so Space, →, and ↓ all behave like the
// on-screen forward button (and ←, ↑, Shift+Space all go back).
// We modify the existing entries so every other shortcut (overview, goto,
// fullscreen, dark-mode…) and Slidev's overview-mode guards stay intact.
//
// Exporting a plain function is equivalent to `defineShortcutsSetup(fn)` (that
// helper is just an identity function for types); we avoid importing
// `@slidev/types` so the setup resolves cleanly during the static build.
export default function shortcuts(nav, defaultShortcuts) {
  return defaultShortcuts.map((shortcut) => {
    if (shortcut.name === 'next_down') return { ...shortcut, fn: () => nav.next() }
    if (shortcut.name === 'prev_up') return { ...shortcut, fn: () => nav.prev() }
    return shortcut
  })
}
