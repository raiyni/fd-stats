// @ts-nocheck

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { ColumnHider } from './../gridjs/ColumnHider'
import DataTable from 'react-data-table-component'
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

  // const gridRef = useRef(null)

  const columns = [
    {
      name: 'Owner',
      selector: 'owner',
      sort: false
    },
    {
      name: 'Points For',
      selector: 'pointsFor',
      dataIndex: 'pointsFor',
      render: ({ value }) => Number(value).toLocaleString()
    },
    {
      name: 'Points Against',
      selector: 'pointsAgainst',
      dataIndex: 'pointsAgainst',
      render: ({ value }) => Number(value).toLocaleString()
    },
    {
      name: 'Wins',
      selector: 'wins'
    },
    {
      name: 'Losses',
      selector: 'losses'
    },
    // {
    //   name: 'Games',
    //   data: (row) => row.wins + row.losses
    // },
    {
      name: 'Playoff Wins',
      selector: 'playoffWins'
    },
    {
      name: 'Playoff Losses',
      selector: 'playoffLosses'
    },
    // {
    //   name: 'Playoff Games',
    //   data: (row) => row.playoffWins + row.playoffLosses
    // },
    {
      name: 'Championships',
      selector: 'championships'
    }
  ]

  function filterData() {
    const teams = {}
    store.forEach((row) => {
      if (row.year < from || row.year > to) {
        return
      }
      const team = teams[row.key] || {
        pointsFor: 0,
        pointsAgainst: 0,
        wins: 0,
        losses: 0,
        playoffWins: 0,
        playoffLosses: 0,
        championships: 0,
        owner: row.owner,
        selector: row.id
      }
      teams[row.id] = team

      team.pointsFor += row.pointsFor
      team.pointsAgainst += row.pointsAgainst
      team.wins += row.wins
      team.losses += row.losses
      team.playoffWins += row.playoffWins
      team.playoffLosses += row.playoffLosses
      team.championships += row.championships
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
    <>
      <div>
        <YearRange
          filterChange={(from, to) => dispatch(setYears({ from, to }))}
          from={from}
          to={to}
        />
        <hr />
      </div>
      <DataTable data={proxyStore} columns={columns} />
    </>
  )
}

export default Standings
