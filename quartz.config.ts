import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Драконы",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "Mintberry69crunch.github.io/world-of-dragons",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
          unreadBadge: "#93161A",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
          unreadBadge: "#93161A",
        },
        Фликс: {
          light: "#160b09",
          lightgray: "#38211a",
          gray: "#805347",
          darkgray: "#dbc0ae",
          dark: "#fff3df",
          secondary: "#ff7138",
          tertiary: "#ffc247",
          highlight: "rgba(255, 96, 32, 0.2)",
          textHighlight: "#ff9f1c55",
          unreadBadge: "#93161A",
        },
        Гровель: {
          light: "#101217",
          lightgray: "#2d2a21",
          gray: "#9a8f6b",
          darkgray: "#ded3b5",
          dark: "#fff6d9",
          secondary: "#e6b83f",
          tertiary: "#ffe59a",
          highlight: "rgba(230, 184, 63, 0.2)",
          textHighlight: "#d6a52c66",
          unreadBadge: "#a63d40",
        },
        Эрагон: {
          light: "#081722",
          lightgray: "#183143",
          gray: "#789aad",
          darkgray: "#c5dce6",
          dark: "#f0fbff",
          secondary: "#45b8d4",
          tertiary: "#62d4c2",
          highlight: "rgba(38, 154, 190, 0.2)",
          textHighlight: "#2aa6c866",
          unreadBadge: "#a94335",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: false,
        enableRSS: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
