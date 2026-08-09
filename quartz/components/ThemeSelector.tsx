// @ts-ignore
import themeSelectorScript from "./scripts/themeSelector.inline"
import styles from "./styles/themeSelector.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { ColorScheme, themeKeyToValue } from "../util/theme"

const formatThemeName = (key: string) => {
  const name = key.replace(/Mode$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const ThemePreview = ({ colors, image }: { colors: ColorScheme; image?: string }) => (
  <span
    class="theme-preview"
    style={`--preview-light: ${colors.light}; --preview-accent: ${colors.secondary}; --preview-dark: ${colors.dark};`}
    data-has-image={image ? "true" : "false"}
    aria-hidden="true"
  >
    <img class="theme-preview-image" src={image} alt="" loading="lazy" hidden={!image} />
    <span class="theme-preview-color theme-preview-light"></span>
    <span class="theme-preview-color theme-preview-accent"></span>
    <span class="theme-preview-color theme-preview-dark"></span>
  </span>
)

const ThemeSelector: QuartzComponent = ({ displayClass, cfg, allFiles }: QuartzComponentProps) => {
  const translations = i18n(cfg.locale).components.themeToggle
  const themes = Object.entries(cfg.theme.colors).map(([key, colors]) => {
    const character = allFiles.find((file) => file.frontmatter?.title === key)
    const socialImage = character?.frontmatter?.socialImage

    return {
      value: themeKeyToValue(key),
      label:
        key === "lightMode"
          ? translations.lightMode
          : key === "darkMode"
            ? translations.darkMode
            : formatThemeName(key),
      colors,
      image: typeof socialImage === "string" ? socialImage : undefined,
    }
  })
  const initialTheme = themes[0]

  return (
    <div class={classNames(displayClass, "theme-selector")}>
      <span class="visually-hidden">Color theme</span>
      <button
        type="button"
        class="theme-selector-trigger"
        aria-label={`Color theme: ${initialTheme.label}`}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <ThemePreview colors={initialTheme.colors} image={initialTheme.image} />
        <span class="theme-selector-label">{initialTheme.label}</span>
        <span class="theme-selector-chevron" aria-hidden="true"></span>
      </button>
      <div class="theme-options" role="listbox" aria-label="Color theme" hidden>
        {themes.map((theme) => (
          <button
            type="button"
            class="theme-option"
            role="option"
            aria-selected="false"
            data-theme={theme.value}
            data-preview-light={theme.colors.light}
            data-preview-accent={theme.colors.secondary}
            data-preview-dark={theme.colors.dark}
            data-preview-image={theme.image}
          >
            <ThemePreview colors={theme.colors} image={theme.image} />
            <span class="theme-option-label">{theme.label}</span>
            <span class="theme-option-check" aria-hidden="true">
              ✓
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

ThemeSelector.beforeDOMLoaded = themeSelectorScript
ThemeSelector.css = styles

export default (() => ThemeSelector) satisfies QuartzComponentConstructor
