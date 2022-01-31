import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-14 flex flex-col lg:flex-row items-center">
          <h3 className="text-4s lg:text-5s font-bold tracking-tighter leading-tight text-center lg:text-left lg:w-1/2 mx-auto">
            Statically Generated with Next.js.
            <span className="badge bg-secondary">
            <a
              href="https://github.com/gpwork4u/gpwork4u.github.io"
              className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              View on GitHub
            </a></span>
          </h3>
        </div>
      </Container>
    </footer>
  )
}
