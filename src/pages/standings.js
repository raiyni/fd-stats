// @ts-nocheck

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { YearRange } from './year-range'
import { fetchStandings } from './../redux/reducers/standings'
import { setYears } from 'redux/reducers/standings'

export const Standings = () => {
  const dispatch = useDispatch()

  const [proxyStore, setProxyStore] = useState([])

  const from = useSelector((state) => state.standings.from)
  const to = useSelector((state) => state.standings.to)
  const loading = useSelector((state) => state.standings.loading)
  const store = useSelector((state) => state.standings.store)

  const columns = [
    {
      header: 'Owner',
      field: 'owner',
      sortable: false
    },
    {
      header: 'Points For',
      field: 'pointsFor',
      body: (row) => Number(row.pointsFor).toLocaleString()
    },
    {
      header: 'Points Against',
      field: 'pointsAgainst',
      body: (row) => Number(row.pointsAgainst).toLocaleString()
    },
    {
      header: 'Wins',
      field: 'wins'
    },
    {
      header: 'Losses',
      field: 'losses'
    },
    {
      header: 'Games',
      field: 'games'
    },
    {
      header: 'Win %',
      body: (row) => row['win%'].toFixed(3),
      field: 'win%'
    },
    {
      header: 'Playoff Wins',
      field: 'playoffWins'
    },
    {
      header: 'Playoff Losses',
      field: 'playoffLosses'
    },
    {
      header: 'Playoff Games',
      field: 'playoffGames'
    },
    {
      header: 'Playoff %',
      body: (row) => row['pwin%'].toFixed(3),
      field: 'pwin%'
    },
    {
      header: 'Championships',
      field: 'championships'
    }
  ]

  function filterData() {
    const teams = {}
    store.forEach((row) => {
      if (row.year < from || row.year > to) {
        return
      }
      const team = teams[row.id] || {
        pointsFor: 0,
        pointsAgainst: 0,
        wins: 0,
        losses: 0,
        games: 0,
        'win%': 0,
        playoffWins: 0,
        playoffLosses: 0,
        playoffGames: 0,
        'pwin%': 0,
        championships: 0,
        owner: row.owner,
        field: row.id
      }
      teams[row.id] = team

      team.pointsFor += row.pointsFor
      team.pointsAgainst += row.pointsAgainst
      team.wins += row.wins
      team.losses += row.losses
      team.playoffWins += row.playoffWins
      team.playoffLosses += row.playoffLosses
      team.championships += row.championships

      team.games = team.wins + team.losses
      team.playoffGames = team.playoffWins + team.playoffLosses
      team['win%'] = team.wins / team.games
      team['pwin%'] = team.playoffWins / team.playoffGames
    })

    setProxyStore(Object.values(teams))
  }

  useEffect(() => {
    if (!loading) {
      filterData()
    }
  }, [from, to, loading])

  useEffect(() => {
    if (loading) dispatch(fetchStandings)
  }, [])

  return (
    <div className="p-card" style={{ padding: 10 }}>
      <DataTable
        sortMode="multiple"
        value={proxyStore}
        className="p-datatable-sm p-datatable-striped"
        header={
          <YearRange
            filterChange={(from, to) => dispatch(setYears({ from, to }))}
            from={from}
            to={to}
          />
        }
        stateKey="standingsTable"
        stateStorage="session"
      >
        {columns.map((c) => {
          return (
            <Column
              {...c}
              key={c.header}
              sortable={c.sortable === false ? false : true}
            />
          )
        })}
      </DataTable>
    </div>
  )
}

export default Standings
