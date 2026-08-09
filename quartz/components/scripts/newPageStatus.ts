import { ContentDetails } from "../../plugins/emitters/contentIndex"
import { FileTrieNode } from "../../util/fileTrie"
import { FullSlug } from "../../util/path"

type HashSnapshot = Record<string, string>
type NewBadge = {
  kind: "file" | "folder"
  label?: string
}

const HASH_STORAGE_KEY = "explorerVisitedFileHashes"
const LEGACY_HASH_STORAGE_KEY = "explorerFileHashes"
const LEGACY_CHANGES_SESSION_KEY = "explorerChangedFiles"

function parseStoredValue<T>(value: string | null): T | undefined {
  if (!value) return undefined

  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export function getChangedSlugs(
  entries: [FullSlug, ContentDetails][],
  currentSlug: FullSlug,
): Set<FullSlug> {
  const currentHashes = Object.fromEntries(
    entries.filter(([, details]) => details.hash).map(([slug, details]) => [slug, details.hash]),
  )
  const visitedHashes = parseStoredValue<HashSnapshot>(localStorage.getItem(HASH_STORAGE_KEY)) ?? {}
  const changedSlugs = new Set(
    Object.entries(currentHashes)
      .filter(([slug, hash]) => visitedHashes[slug] !== hash)
      .map(([slug]) => slug as FullSlug),
  )

  const retainedHashes = Object.fromEntries(
    Object.entries(visitedHashes).filter(([slug]) => currentHashes[slug] !== undefined),
  )
  const currentHash = currentHashes[currentSlug]
  if (currentHash) {
    retainedHashes[currentSlug] = currentHash
    changedSlugs.delete(currentSlug)
  }

  localStorage.setItem(HASH_STORAGE_KEY, JSON.stringify(retainedHashes))
  localStorage.removeItem(LEGACY_HASH_STORAGE_KEY)
  sessionStorage.removeItem(LEGACY_CHANGES_SESSION_KEY)

  return changedSlugs
}

export function getNewBadge(node: FileTrieNode, changedSlugs: Set<FullSlug>): NewBadge | undefined {
  if (!node.isFolder) {
    return changedSlugs.has(node.slug) ? { kind: "file" } : undefined
  }

  const changedCount = node
    .entries()
    .filter(([slug, child]) => child.data?.hash && changedSlugs.has(slug)).length
  return changedCount > 0 ? { kind: "folder", label: changedCount.toString() } : undefined
}

export function renderNewBadge(
  target: HTMLElement,
  node: FileTrieNode,
  changedSlugs: Set<FullSlug>,
) {
  renderBadge(target, getNewBadge(node, changedSlugs), node.isFolder)
}

export function renderNewFileBadge(
  target: HTMLElement,
  slug: FullSlug,
  changedSlugs: Set<FullSlug>,
) {
  renderBadge(target, changedSlugs.has(slug) ? { kind: "file" } : undefined, false)
}

function renderBadge(target: HTMLElement, status: NewBadge | undefined, isFolder: boolean) {
  target.querySelector(":scope > .new-page-badge")?.remove()
  target.classList.remove("new-page-status")

  if (!status) return

  const badge = document.createElement("span")
  badge.className = `new-page-badge new-page-badge-${status.kind}`
  badge.textContent = status.label ?? ""
  badge.title = isFolder ? `${status.label} new pages` : "New page"
  badge.setAttribute("aria-label", badge.title)
  target.classList.add("new-page-status")
  target.appendChild(badge)
}
