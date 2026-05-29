export default async function inlineCssFallback() {
  try {
    // Delay to allow Vite or server to inject link elements
    await new Promise((r) => setTimeout(r, 150))
    if (document.getElementById('inline-css')) return

    // Find stylesheet link that looks like built CSS
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[]
    const candidate = links.find(l => /assets\/.+\.css$/.test(l.href) || /index-.*\.css$/.test(l.getAttribute('href') || ''))
    const href = candidate?.href || links[0]?.href
    if (!href) return

    // Try fetching the CSS and injecting inline to guarantee styles
    const res = await fetch(href, { cache: 'no-store' })
    if (!res.ok) return
    const css = await res.text()
    const style = document.createElement('style')
    style.id = 'inline-css'
    style.textContent = css
    document.head.appendChild(style)
  } catch (e) {
    // silent fallback
  }
}
