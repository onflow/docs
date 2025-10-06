import fs from 'fs'
import { parse } from 'csv-parse/sync'
import Typesense from 'typesense'
import 'dotenv/config'

// --- static config (you requested) ---
const TYPESENSE_COLLECTION = 'flow_docs'
const TYPESENSE_QUERY_BY = 'title,headings,content'
const TYPESENSE_PER_PAGE = 5
const TYPESENSE_PROTOCOL = 'https'
const TYPESENSE_PORT = 443
const TYPESENSE_ID_FIELD = 'id'
// -------------------------------------

const {
  TYPESENSE_NODE,
  TYPESENSE_SEARCH_ONLY_API_KEY,
  TYPESENSE_ADMIN_API_KEY
} = process.env

if (!TYPESENSE_NODE || !TYPESENSE_SEARCH_ONLY_API_KEY) {
  console.error('Missing TYPESENSE_NODE or TYPESENSE_SEARCH_ONLY_API_KEY in .env')
  process.exit(1)
}

const client = new Typesense.Client({
  nodes: [{ host: TYPESENSE_NODE, port: TYPESENSE_PORT, protocol: TYPESENSE_PROTOCOL }],
  apiKey: TYPESENSE_SEARCH_ONLY_API_KEY,
  connectionTimeoutSeconds: 8
})

function toLabelSet(s) {
  return new Set(
    String(s || '')
      .split('|')
      .map(x => x.trim())
      .filter(Boolean)
  )
}

const csv = fs.readFileSync('queries.csv', 'utf8')
const rows = parse(csv, { columns: true, skip_empty_lines: true })

if (!rows.length) {
  console.error('queries.csv has no rows')
  process.exit(1)
}

let hits = 0
const diagnostics = []

for (const row of rows) {
  const query = String(row.query || '').trim()
  const labels = toLabelSet(row.labels)
  if (!query || labels.size === 0) {
    diagnostics.push({ query, error: 'Missing query or labels', hit: false })
    continue
  }

  try {
    const res = await client
      .collections(TYPESENSE_COLLECTION)
      .documents()
      .search({
        q: query,
        query_by: TYPESENSE_QUERY_BY,
        per_page: TYPESENSE_PER_PAGE,
        enable_analytics: false
      })

    const topIds = (res.hits || []).map(h => {
      const doc = h.document || {}
      return doc[TYPESENSE_ID_FIELD] ?? doc.id ?? doc.slug ?? ''
    })

    const gotHit = topIds.some(id => labels.has(String(id)))
    if (gotHit) hits++

    diagnostics.push({ query, labels: [...labels], top5: topIds, hit: gotHit })
  } catch (e) {
    diagnostics.push({ query, error: e.message, hit: false })
  }
}

const r5 = (hits / rows.length) * 100
console.log(`Relevance@5: ${r5.toFixed(1)}%  (${hits}/${rows.length})`)
fs.writeFileSync('diagnostics.json', JSON.stringify(diagnostics, null, 2))
console.log('Wrote diagnostics.json')
