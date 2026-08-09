const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const initialTheme = localStorage.getItem("theme") ?? preferredTheme

document.documentElement.setAttribute("saved-theme", initialTheme)

const applyTheme = (theme: string, persist = true) => {
  document.documentElement.setAttribute("saved-theme", theme)
  if (persist) localStorage.setItem("theme", theme)

  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const selectors = Array.from(document.querySelectorAll<HTMLElement>(".theme-selector"))
  const firstOptions = selectors[0]?.querySelectorAll<HTMLElement>(".theme-option") ?? []
  const availableThemes = Array.from(firstOptions, (option) => option.dataset.theme ?? "")
  const currentTheme = document.documentElement.getAttribute("saved-theme")
  const fallbackTheme = availableThemes.includes(preferredTheme)
    ? preferredTheme
    : availableThemes[0]
  const activeTheme =
    currentTheme && availableThemes.includes(currentTheme) ? currentTheme : fallbackTheme

  const closeSelector = (selector: HTMLElement, restoreFocus = false) => {
    const trigger = selector.querySelector<HTMLButtonElement>(".theme-selector-trigger")
    const options = selector.querySelector<HTMLElement>(".theme-options")
    if (!trigger || !options) return

    options.hidden = true
    trigger.setAttribute("aria-expanded", "false")
    if (restoreFocus) trigger.focus()
  }

  const syncSelector = (selector: HTMLElement, theme: string) => {
    const options = Array.from(selector.querySelectorAll<HTMLButtonElement>(".theme-option"))
    const selected = options.find((option) => option.dataset.theme === theme)
    const trigger = selector.querySelector<HTMLButtonElement>(".theme-selector-trigger")
    const triggerLabel = selector.querySelector<HTMLElement>(".theme-selector-label")
    const triggerPreview = selector.querySelector<HTMLElement>(
      ".theme-selector-trigger .theme-preview",
    )
    if (!selected || !trigger || !triggerLabel || !triggerPreview) return

    const label = selected.querySelector<HTMLElement>(".theme-option-label")?.textContent ?? theme
    triggerLabel.textContent = label
    trigger.setAttribute("aria-label", `Color theme: ${label}`)
    triggerPreview.style.setProperty("--preview-light", selected.dataset.previewLight ?? "")
    triggerPreview.style.setProperty("--preview-accent", selected.dataset.previewAccent ?? "")
    triggerPreview.style.setProperty("--preview-dark", selected.dataset.previewDark ?? "")
    const previewImage = selected.dataset.previewImage ?? ""
    const triggerImage = triggerPreview.querySelector<HTMLImageElement>(".theme-preview-image")
    triggerPreview.dataset.hasImage = String(previewImage.length > 0)
    if (triggerImage) {
      triggerImage.hidden = previewImage.length === 0
      if (previewImage) triggerImage.src = previewImage
      else triggerImage.removeAttribute("src")
    }

    for (const option of options) {
      option.setAttribute("aria-selected", String(option === selected))
    }
  }

  const syncAllSelectors = (theme: string) => {
    for (const selector of selectors) syncSelector(selector, theme)
  }

  if (activeTheme) {
    if (activeTheme !== currentTheme) {
      const storedTheme = localStorage.getItem("theme")
      if (storedTheme && !availableThemes.includes(storedTheme)) localStorage.removeItem("theme")
      applyTheme(activeTheme, false)
    }
    syncAllSelectors(activeTheme)
  }

  const selectTheme = (theme: string) => {
    applyTheme(theme)
    syncAllSelectors(theme)
    for (const selector of selectors) closeSelector(selector)
  }

  for (const selector of selectors) {
    const trigger = selector.querySelector<HTMLButtonElement>(".theme-selector-trigger")
    const menu = selector.querySelector<HTMLElement>(".theme-options")
    const options = Array.from(selector.querySelectorAll<HTMLButtonElement>(".theme-option"))
    if (!trigger || !menu) continue

    const openSelector = (focusOption = false) => {
      for (const otherSelector of selectors) {
        if (otherSelector !== selector) closeSelector(otherSelector)
      }
      menu.hidden = false
      trigger.setAttribute("aria-expanded", "true")
      if (focusOption) {
        ;(
          options.find((option) => option.getAttribute("aria-selected") === "true") ?? options[0]
        )?.focus()
      }
    }

    const handleTriggerClick = () => {
      if (menu.hidden) openSelector()
      else closeSelector(selector)
    }

    const handleTriggerKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        openSelector(true)
      } else if (event.key === "Escape") {
        closeSelector(selector)
      }
    }

    const handleMenuClick = (event: Event) => {
      const option = (event.target as HTMLElement).closest<HTMLButtonElement>(".theme-option")
      if (option?.dataset.theme) selectTheme(option.dataset.theme)
    }

    const handleMenuKeydown = (event: KeyboardEvent) => {
      const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement)
      let nextIndex: number | undefined

      if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % options.length
      if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + options.length) % options.length
      if (event.key === "Home") nextIndex = 0
      if (event.key === "End") nextIndex = options.length - 1
      if (event.key === "Escape") {
        event.preventDefault()
        closeSelector(selector, true)
        return
      }

      if (nextIndex !== undefined) {
        event.preventDefault()
        options[nextIndex]?.focus()
      }
    }

    trigger.addEventListener("click", handleTriggerClick)
    trigger.addEventListener("keydown", handleTriggerKeydown)
    menu.addEventListener("click", handleMenuClick)
    menu.addEventListener("keydown", handleMenuKeydown)
    window.addCleanup(() => {
      trigger.removeEventListener("click", handleTriggerClick)
      trigger.removeEventListener("keydown", handleTriggerKeydown)
      menu.removeEventListener("click", handleMenuClick)
      menu.removeEventListener("keydown", handleMenuKeydown)
    })
  }

  const closeOnOutsideClick = (event: PointerEvent) => {
    for (const selector of selectors) {
      if (!selector.contains(event.target as Node)) closeSelector(selector)
    }
  }
  document.addEventListener("pointerdown", closeOnOutsideClick)
  window.addCleanup(() => document.removeEventListener("pointerdown", closeOnOutsideClick))

  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  const followSystemTheme = (event: MediaQueryListEvent) => {
    if (localStorage.getItem("theme") !== null) return
    const systemTheme = event.matches ? "dark" : "light"
    if (!availableThemes.includes(systemTheme)) return

    applyTheme(systemTheme, false)
    syncAllSelectors(systemTheme)
  }
  colorSchemeMediaQuery.addEventListener("change", followSystemTheme)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", followSystemTheme))
})
