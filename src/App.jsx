import Converter from './components/Converter.jsx'
export default function App(){
  return (
    <main className="min-h-screen bg-night text-ink font-body">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        <Converter />
        <footer className="text-center opacity-60 text-xs py-6">
          CS2MarketPrice • GitHub Pages • © 2025
        </footer>
      </div>
    </main>
  )
}
