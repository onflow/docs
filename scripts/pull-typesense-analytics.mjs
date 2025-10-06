import fs from 'fs'
import Typesense from 'typesense'
import 'dotenv/config'
import { stringify } from 'csv-stringify/sync'

// ---------- CONFIG YOU CAN EDIT ----------
const TYPESENSE_PROTOCOL = 'https'
const TYPESENSE_PORT = 443

// Destination collections you configured in your analytics rules
// (rename to your actual collection names if different)
const POPULAR_QUERIES_COLLECTION = 'doc_queries'   // popular_queries dest
const NOHITS_QUERIES_COLLECTION  = 'doc_nohits'    // no_hits_queries dest

// How many queries to pull from each collection
const LIMIT_POPULAR = 200
const LIMIT_NOHITS  = 200

// Output CSV path (you'll label these in the `labels` column)
const OUTPUT_CSV = 'queries_from_analytics.csv'
// -----------------------------------------

const { TYPESENSE_NODE, TYPESENSE_SEARCH_ONLY_API_KEY } = process.env
if (!TYPESENSE_NODE || !TYPESENSE_SEARCH_ONLY_API_KEY) {
  console.error('Missing TYPESENSE_NODE or TYPESENSE_SEARCH_ONLY_API_KEY in .env')
  process.exit(1)
}

const client = new Typesense.Client({
  nodes: [{ host: TYPESENSE_NODE, port: TYPESENSE_PORT, protocol: TYPESENSE_PROTOCOL }],
  apiKey: TYPESENSE_SEARCH_ONLY_API_KEY,
  connectionTimeoutSeconds: 8
})

async function fetchTopQueries(collectionName, limit) {
  // These analytics destination collections typically have fields: q (string), count (int)
  // We just sort by count desc and pull the top N
  const res = await client
    .collections(collectionName)
    .documents()
    .search({
      q: '*',                // wildcard
      query_by: 'q',         // search by the query string field
      per_page: limit,
      sort_by: 'count:desc'
    })
  return (res.hits || []).map(h => ({ q: h.document.q, count: h.document.count }))
}

function mergeAndDedup(popular, nohits) {
  // Merge two lists by query text, keep max count, and tag the source(s)
  const map = new Map()
  for (const { q, count } of popular) {
    const key = (q || '').trim()
    if (!key) continue
    const prev = map.get(key) || { q: key, count: 0, sources: new Set() }
    prev.count = Math.max(prev.count, Number(count) || 0)
    prev.sources.add('popular')
    map.set(key, prev)
  }
  for (const { q, count } of nohits) {
    const key = (q || '').trim()
    if (!key) continue
    const prev = map.get(key) || { q: key, count: 0, sources: new Set() }
    prev.count = Math.max(prev.count, Number(count) || 0)
    prev.sources.add('nohits')
    map.set(key, prev)
  }
  const rows = Array.from(map.values()).map(r => ({
    query: r.q,
    count: r.count,
    source: Array.from(r.sources).sort().join('+')
  }))
  // Sort by count desc
  rows.sort((a, b) => (b.count - a.count) || a.query.localeCompare(b.query))
  return rows
}

async function main() {
  let popular = []
  let nohits = []
  try {
    popular = await fetchTopQueries(POPULAR_QUERIES_COLLECTION, LIMIT_POPULAR)
  } catch (e) {
    console.warn(`Warning: failed to read ${POPULAR_QUERIES_COLLECTION}: ${e.message}`)
  }
  try {
    nohits = await fetchTopQueries(NOHITS_QUERIES_COLLECTION, LIMIT_NOHITS)
  } catch (e) {
    console.warn(`Warning: failed to read ${NOHITS_QUERIES_COLLECTION}: ${e.message}`)
  }

  if (popular.length === 0 && nohits.length === 0) {
    console.error('No analytics queries found. Make sure your analytics rules are set and traffic has been flushed.')
    process.exit(2)
  }

  const merged = mergeAndDedup(popular, nohits)

  // Produce a CSV with an empty labels column (for you to fill)
  const csv = stringify(
    merged.map(r => [r.query, /* labels */ '', r.source, r.count]),
    { header: true, columns: ['query', 'labels', 'source', 'count'] }
  )
  fs.writeFileSync(OUTPUT_CSV, csv)
  console.log(`Wrote ${OUTPUT_CSV} with ${merged.length} queries.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
