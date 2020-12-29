import fetch from 'node-fetch'

export const HOST = 'https://www.fleaflicker.com/api'

async function getUrl(path, params = {}) {
  return fetch(
    `${HOST}/${path}?` +
      new URLSearchParams({
        league_id: process.env.LEAGUE_ID,
        ...params,
      }),
  )
}

export async function getDraft(year) {
  const response = await getUrl('FetchLeagueDraftBoard', {
    season: year,
  })

  if (response.ok) {
    return response.json()
  }

  throw new Error(response.statusText)
}

export async function getStandings(year) {
  const response = await getUrl('FetchLeagueStandings', {
    season: year,
  })

  if (response.ok) {
    return response.json()
  }

  throw new Error(response.statusText)
}

export async function getTransactions(offset) {
  const response = await getUrl('FetchLeagueTransactions', {
    result_offset: offset,
  })

  if (response.ok) {
    return response.json()
  }

  throw new Error(response.statusText)
}
