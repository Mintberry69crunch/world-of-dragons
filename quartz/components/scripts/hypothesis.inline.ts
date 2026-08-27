type HypothesisConfig = {
  commentsMode: true
  openSidebar: false
  groupsAllowlist?: string[]
}

const unloadHypothesis = () => {
  const appLink = document.querySelector<HTMLLinkElement>('link[type="application/annotator+html"]')
  appLink?.dispatchEvent(new Event("destroy"))

  document.querySelector("script[data-hypothesis-embed]")?.remove()
  document.querySelector("script[data-hypothesis-config]")?.remove()
}

document.addEventListener("nav", () => {
  const container = document.querySelector<HTMLElement>(".hypothesis")
  if (!container) {
    return
  }

  const config: HypothesisConfig = {
    commentsMode: true,
    openSidebar: false,
  }

  const groupId = container.dataset.groupId
  if (groupId) {
    config.groupsAllowlist = [groupId]
  }

  const configScript = document.createElement("script")
  configScript.type = "application/json"
  configScript.className = "js-hypothesis-config"
  configScript.dataset.hypothesisConfig = ""
  configScript.textContent = JSON.stringify(config)
  document.body.appendChild(configScript)

  const embedScript = document.createElement("script")
  embedScript.src = "https://hypothes.is/embed.js"
  embedScript.async = true
  embedScript.dataset.hypothesisEmbed = ""
  document.body.appendChild(embedScript)

  window.addCleanup(unloadHypothesis)
})
