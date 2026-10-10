import { Section } from './Section'
import { VideoPortfolio } from './VideoPortfolio'
import { PhotoPortfolio } from './PhotoPortfolio'
import { videoEditing, videography } from '@/content/portfolio'

/**
 * The portfolio block: three subsections sharing one visual language.
 * Each carries its own anchor id so the service cards and nav can link
 * straight to it.
 */
export function Portfolio() {
  return (
    <Section
      id="portfolio"
      eyebrow="Portfolio"
      title="Selected work"
      lead="Work across editing, photography and videography — organised by discipline and category."
    >
      <div className="space-y-20 sm:space-y-24">
        <div id="video-editing" className="scroll-mt-28">
          <VideoPortfolio section={videoEditing} />
        </div>

        <div id="photography" className="scroll-mt-28 border-t border-line pt-20 sm:pt-24">
          <PhotoPortfolio />
        </div>

        <div id="videography" className="scroll-mt-28 border-t border-line pt-20 sm:pt-24">
          <VideoPortfolio section={videography} />
        </div>
      </div>
    </Section>
  )
}
