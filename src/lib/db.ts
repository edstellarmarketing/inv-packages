import postgres from 'postgres'

declare global {
  // eslint-disable-next-line no-var
  var __pg: ReturnType<typeof postgres> | undefined
}

function build() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add a Postgres connection string in .env.local.',
    )
  }
  return postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: url.includes('sslmode=disable') ? false : 'prefer',
    prepare: false,
  })
}

export function getDb() {
  if (!global.__pg) global.__pg = build()
  return global.__pg
}
