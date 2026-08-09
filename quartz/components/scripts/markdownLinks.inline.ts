import { ContentDetails } from "../../plugins/emitters/contentIndex"
import { FullSlug } from "../../util/path"
import { getChangedSlugs, renderNewFileBadge } from "./newPageStatus"

document.addEventListener("nav", async (event: CustomEventMap["nav"]) => {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    ".center article a.internal[data-slug]",
  )
  if (links.length === 0) return

  const data = await fetchData
  const entries = [...Object.entries(data)] as [FullSlug, ContentDetails][]
  const changedSlugs = getChangedSlugs(entries, event.detail.url)

  for (const link of links) {
    const slug = link.dataset.slug as FullSlug | undefined
    if (!slug) continue
    renderNewFileBadge(link, slug, changedSlugs)
  }
})
