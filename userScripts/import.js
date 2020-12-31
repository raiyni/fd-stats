import * as api from '../api/index.js'

import { YEARS } from '../src/data'

require('dotenv').config()

const NOOP = () => {}

const fs = require('fs')
const owners = new Map()

async function updateStandings() {
  const dir = 'public/data/standings'
  fs.mkdirSync(dir, { recursive: true })

  for (let i = 0; i < YEARS.length; i++) {
    const year = YEARS[i]
    const data = await api.getStandings(year)
    const standings = []

    data.divisions.forEach((division) => {
      division.teams.forEach((team) => {
        standings.push(team)
        team.owners.forEach((owner) => {
          if (!owners.has(owner.id)) {
            owners.set(owner.id, owner)
          }
        })
      })
    })

    fs.writeFile(`${dir}/${year}.json`, JSON.stringify(standings), NOOP)
  }
}

function updateOwners() {
  const arr = Array.from(owners, ([key, value]) => value)
  fs.writeFile(`public/data/owners.json`, JSON.stringify(arr, null, 2), NOOP)
}

const transactions = []

async function updateTransactions() {
  let idx = 0

  do {
    const data = await api.getTransactions(idx)

    if (data.items) {
      transactions.push(...data.items)
    }

    idx = data.resultOffsetNext
  } while (idx)

  fs.writeFile(`data/transactions.json`, JSON.stringify(transactions), NOOP)
}

async function main() {
  await updateStandings()
  updateOwners()
  // await updateTransactions()
}

main()
