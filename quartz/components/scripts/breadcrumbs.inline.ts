import { ContentDetails } from "../../plugins/emitters/contentIndex"
import { FileTrieNode } from "../../util/fileTrie"
import { FullSlug } from "../../util/path"
import { getChangedSlugs, renderNewBadge } from "./newPageStatus"

document.addEventListener("nav", async (event: CustomEventMap["nav"]) => {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    ".breadcrumb-container a[data-breadcrumb-slug]",
  )
  if (links.length === 0) return

  const data = await fetchData
  const entries = [...Object.entries(data)] as [FullSlug, ContentDetails][]
  const changedSlugs = getChangedSlugs(entries, event.detail.url)
  const trie = FileTrieNode.fromEntries(entries)

  for (const link of links) {
    const slug = link.dataset.breadcrumbSlug as FullSlug | undefined
    const title = link.dataset.breadcrumbTitle
    if (!slug || !title) continue

    const node = trie.findNode(slug.split("/"))
    if (!node) continue
    link.textContent = title
    renderNewBadge(link, node, changedSlugs)
  }
})
