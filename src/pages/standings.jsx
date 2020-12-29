import 'gridjs/dist/theme/mermaid.css'

import { useEffect, useState } from 'react'

import { Grid } from 'gridjs-react'
import { YEARS } from 'data.js'
import { YearRange } from './year-range'

export default function Standings() {
  const [owners, setOwners] = useState({})
  const [store, setStore] = useState([])
  const [proxyStore, setProxyStore] = useState([])
  const [years, setYears] = useState({
    from: YEARS[0],
    to: YEARS[YEARS.length - 1],
  })

  const columns = [
    {
      name: 'Owner',
      id: 'owner',
    },
    {
      name: 'Points For',
      id: 'pointsFor',
      dataIndex: 'pointsFor',
      formatter: (text) => Number(text).toLocaleString(),
    },
    {
      name: 'Points Against',
      id: 'pointsAgainst',
      dataIndex: 'pointsAgainst',
      formatter: (text) => Number(text).toLocaleString(),
    },
    {
      name: 'Wins',
      id: 'wins',
    },
    {
      name: 'Losses',
      id: 'losses',
    },
    {
      name: 'Games',
      id: 'games',
    },
    {
      name: 'Playoff Wins',
      id: 'playoffWins',
    },
    {
      name: 'Playoff Losses',
      id: 'playoffLosses',
    },
    {
      name: 'Playoff Games',
      id: 'playoffGames',
    },
    {
      name: 'Championships',
      id: 'championships',
    },
  ]

  function filterData() {
    const teams = {}
    console.log(store)
    store.forEach((season) => {
      season.forEach((row) => {
        if (row.year < years.from || row.year > years.to) {
          return
        }

        const id = row.owners[0].id
        const team = teams[id] || {
          pointsFor: 0,
          pointsAgainst: 0,
          wins: 0,
          losses: 0,
          games: 0,
          playoffWins: 0,
          playoffLosses: 0,
          playoffGames: 0,
          championships: 0,
          owner: row.owners[0].displayName,
          key: id,
        }
        teams[id] = team

        team.pointsFor += row.pointsFor.value
        team.pointsAgainst += row.pointsAgainst.value
        team.wins += row.recordOverall.wins || 0
        team.losses += row.recordOverall.losses || 0
        team.playoffWins += row.recordPostseason.wins || 0
        team.playoffLosses += row.recordPostseason.losses || 0
        team.games = team.wins + team.losses
        team.playoffGames = team.playoffWins + team.playoffLosses
        if (row.recordOverall.rank === 1) {
          team.championships += 1
        }
      })
    })

    setProxyStore(Object.values(teams))
  }

  function onChange(pagination, filters, sorter, extra) {
    // console.log('params', pagination, filters, sorter, extra)
  }

  useEffect(() => {
    fetch('/data/owners.json')
      .then((response) => response.json())
      .then((data) => {
        setOwners(data)
      })
      .then(() => {
        Promise.all(
          YEARS.map((year) =>
            fetch(`/data/standings/${year}.json?year=${year}`)
              .then((response) => response.json())
              .then((json) =>
                json.map((obj) => {
                  obj.year = year
                  return obj
                }),
              ),
          ),
        )
          .then((json) => {
            setStore(json)
            console.log(json)
          })
          .catch((error) => console.log(error))
      })
  }, [])

  useEffect(() => {
    console.log(years)
  }, [years])

  useEffect(() => {
    if (store.length > 0) {
      filterData()
    }
  }, [store, years])

  return (
    <>
      <YearRange
        filterChange={(from, to) => setYears({ from: from, to: to })}
      />
      <hr />
      <Grid data={proxyStore} columns={columns} sort={true} pagination={true} />
    </>
  )
}
