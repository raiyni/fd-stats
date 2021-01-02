import { Select } from 'antd'
import { YEARS } from '../data'
import { useState } from 'react'

const { Option } = Select

export const YearRange = ({ filterChange, from, to }) => {
  const [fromDate, setFromDate] = useState(from)
  const [toDate, setToDate] = useState(to)

  const values = YEARS.map((y) => (
    <Option value={y} key={y}>
      {y}
    </Option>
  ))

  return (
    <>
      <span>From: </span>
      <Select
        style={{ width: 120 }}
        defaultValue={fromDate}
        onChange={(e) => {
          setFromDate(e)
          filterChange(e, toDate)
        }}
      >
        {values}
      </Select>
      <span style={{ marginLeft: '1em' }}>To: </span>
      <Select
        style={{ width: 120 }}
        defaultValue={toDate}
        onChange={(e) => {
          setToDate(e)
          filterChange(fromDate, e)
        }}
      >
        {values}
      </Select>
    </>
  )
}
