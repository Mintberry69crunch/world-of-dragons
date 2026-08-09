// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
// @ts-ignore
import markdownLinksScript from "./scripts/markdownLinks.inline"
import clipboardStyle from "./styles/clipboard.scss"
import newPageStatusStyle from "./styles/newPageStatus.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = concatenateResources(clipboardScript, markdownLinksScript)
Body.css = concatenateResources(clipboardStyle, newPageStatusStyle)

export default (() => Body) satisfies QuartzComponentConstructor
