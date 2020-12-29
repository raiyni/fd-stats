import { useEffect, useState } from 'react'

import { Table } from 'antd'
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
      title: 'Owner',
      key: 'owner',
      dataIndex: 'owner',
    },
    {
      title: 'Points For',
      key: 'pointsFor',
      dataIndex: 'pointsFor',
      sorter: (a, b) => a.pointsFor - b.pointsFor,
      render: (text) => Number(text).toLocaleString(),
    },
    {
      title: 'Points Against',
      key: 'pointsAgainst',
      dataIndex: 'pointsAgainst',
      sorter: (a, b) => a.pointsAgainst - b.pointsAgainst,
      render: (text) => Number(text).toLocaleString(),
    },
    {
      title: 'Wins',
      key: 'wins',
      dataIndex: 'wins',
      sorter: (a, b) => a.wins - b.wins,
    },
    {
      title: 'Losses',
      key: 'losses',
      dataIndex: 'losses',
      sorter: (a, b) => a.losses - b.losses,
    },
    {
      title: 'Games',
      key: 'games',
      dataIndex: 'wins',
      render: function (text, record) {
        return record.wins + record.losses
      },
      sorter: (a, b) => a.wins + a.losses - (b.wins + b.losses),
    },
    {
      title: 'Playoff Wins',
      key: 'playoffWins',
      dataIndex: 'playoffWins',
      sorter: (a, b) => a.playoffWins - b.playoffWins,
    },
    {
      title: 'Playoff Losses',
      key: 'playoffLosses',
      dataIndex: 'playoffLosses',
      sorter: (a, b) => a.playoffLosses - b.playoffLosses,
    },
    {
      title: 'Playoff Games',
      key: 'playoffGames',
      dataIndex: 'playoffWins',
      render: function (text, record) {
        return record.playoffWins + record.playoffLosses
      },
      sorter: (a, b) =>
        a.playoffWins + a.playoffLosses - b.playoffWins - b.playoffLosses,
    },
    {
      title: 'Championships',
      key: 'championships',
      dataIndex: 'championships',
      sorter: (a, b) => a.championships - b.championships,
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
      <Table dataSource={proxyStore} columns={columns} onChange={onChange} />
    </>
  )
}
