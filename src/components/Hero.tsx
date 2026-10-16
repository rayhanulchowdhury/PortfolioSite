import { ArrowIcon } from './Icons'

/**
 * Typography-led hero. No photograph, video or decorative graphic — the
 * impression comes from spacing, scale and alignment alone.
 */
export function Hero() {
  return (
    <section id="home" className="relative scroll-mt-24 pb-24 pt-36 sm:pb-32 sm:pt-44 lg:pb-40 lg:pt-52">
      <div className="shell">
        <p className="eyebrow animate-fade-up">
          Video Editing <span className="mx-2 text-line-strong">/</span> Photography
          <span className="mx-2 text-line-strong">/</span> Videography
        </p>

        <h1 className="mt-7 max-w-4xl text-[2.6rem] font-extrabold leading-[1.05] tracking-tight animate-fade-up sm:text-6xl lg:text-7xl">
           visuals.
          <br />
          <span className="text-purple">Made to make an impact.</span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-muted animate-fade-up sm:text-lg">
          The Editing Plug helps brands, businesses and creators bring their ideas to life
          through video editing, photography and videography.
        </p>

        <div className="mt-10 flex flex-col gap-3 animate-fade-up sm:flex-row sm:items-center">
          <a href="#contact" className="btn-primary">
            Let&rsquo;s Talk
          </a>
          <a href="#portfolio" className="btn-ghost group">
            Explore Our Work
            <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
