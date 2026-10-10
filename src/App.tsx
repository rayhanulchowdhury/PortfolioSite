import { useCallback, useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Services } from './components/Services'
import { Portfolio } from './components/Portfolio'
import { Clients } from './components/Clients'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  // Set when a service card's "Enquire About This Service" is clicked, so the
  // contact form can pre-select the matching option.
  const [requestedService, setRequestedService] = useState('')

  const handleEnquire = useCallback((service: string) => {
    setRequestedService(service)
    document.getElementById('contact')?.scrollIntoView({ block: 'start' })
  }, [])

  const clearRequestedService = useCallback(() => setRequestedService(''), [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-purple focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Services onEnquire={handleEnquire} />
        <Portfolio />
        <Clients />
        <Contact
          preselectedService={requestedService}
          onServiceConsumed={clearRequestedService}
        />
      </main>

      <Footer />
    </>
  )
}
