import { ContentDetails } from "../../plugins/emitters/contentIndex"
import { FileTrieNode } from "../../util/fileTrie"
import { FullSlug } from "../../util/path"
import { getChangedSlugs, renderNewBadge } from "./newPageStatus"

document.addEventListener("nav", async (event: CustomEventMap["nav"]) => {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    ".folder-content .page-listing a[data-page-slug]",
  )
  if (links.length === 0) return

  const data = await fetchData
  const entries = [...Object.entries(data)] as [FullSlug, ContentDetails][]
  const changedSlugs = getChangedSlugs(entries, event.detail.url)
  const trie = FileTrieNode.fromEntries(entries)

  for (const link of links) {
    const slug = link.dataset.pageSlug as FullSlug | undefined
    const title = link.dataset.pageTitle
    if (!slug || !title) continue

    const node = trie.findNode(slug.split("/"))
    if (!node) continue
    link.textContent = title
    renderNewBadge(link, node, changedSlugs)
  }
})
