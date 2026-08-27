import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/hypothesis.inline"

type Options = {
  /** Restrict the sidebar to one Hypothesis group after the private group is created. */
  groupId?: string
}

export default ((opts?: Options) => {
  const Hypothesis: QuartzComponent = () => {
    return <div class="hypothesis" data-group-id={opts?.groupId}></div>
  }

  Hypothesis.afterDOMLoaded = script

  return Hypothesis
}) satisfies QuartzComponentConstructor<Options | undefined>
