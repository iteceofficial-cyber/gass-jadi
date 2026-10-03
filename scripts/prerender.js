import fs from 'node:fs'
import path from 'node:path'

/**
 * Pre-render script for Garut Journey on Vercel and static hosting.
 * Executes TanStack Start server bundle to generate static HTML files in dist/client,
 * completely eliminating Vercel "404 NOT_FOUND" errors.
 */
async function prerender() {
  console.log('🚀 Starting Garut Journey static page generator for Vercel...')

  const serverPath = path.resolve('dist/server/server.js')
  const clientDir = path.resolve('dist/client')

  if (!fs.existsSync(serverPath)) {
    console.error('❌ Error: dist/server/server.js not found. Run vite build first.')
    process.exit(1)
  }

  const { default: server } = await import(serverPath)

  const routes = [
    '/',
    '/wp-admin',
    '/login',
    '/admin',
    '/destinations/mount-papandayan',
    '/destinations/situ-bagendit',
    '/destinations/pantai-santolo',
    '/destinations/pemandian-cipanas',
    '/destinations/darajat-pass',
    '/destinations/candi-cangkuang',
    '/destinations/pantai-rancabuaya',
    '/destinations/alun-alun-garut',
    '/guide/panduan-wisata-garut-pertama-kali',
    '/guide/rekomendasi-kuliner-garut-legendaris',
    '/guide/tips-mendaki-gunung-papandayan',
    '/guide/oleh-oleh-khas-garut-paling-populer',
  ]

  let successCount = 0

  for (const route of routes) {
    try {
      const req = new Request(`http://localhost:3000${route}`)
      const res = await server.fetch(req)

      if (res.status === 200) {
        const html = await res.text()

        if (route === '/') {
          fs.writeFileSync(path.join(clientDir, 'index.html'), html, 'utf-8')
          // Also write 404.html as SPA fallback
          fs.writeFileSync(path.join(clientDir, '404.html'), html, 'utf-8')
        } else {
          const routeClean = route.replace(/^\//, '')
          const targetDir = path.join(clientDir, routeClean)
          fs.mkdirSync(targetDir, { recursive: true })
          fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8')
        }
        successCount++
      } else {
        console.warn(`⚠️ Warning: Route ${route} returned status ${res.status}`)
      }
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to render route ${route}:`, err.message)
    }
  }

  // Fallback: If for any reason /index.html was not written, ensure it exists
  const indexPath = path.join(clientDir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Fatal: index.html could not be generated.')
    process.exit(1)
  }

  console.log(`✅ Pre-render complete! ${successCount} routes generated in dist/client. Ready for Vercel deployment!`)
}

prerender().catch((err) => {
  console.error('❌ Prerender script failed:', err)
  process.exit(1)
})
