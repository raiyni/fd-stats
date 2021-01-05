import { Dropdown } from 'primereact/dropdown'
import { YEARS } from '../data'
import { useState } from 'react'

// const { Option } = Select

export const YearRange = ({ filterChange, from, to }) => {
  const [fromDate, setFromDate] = useState(from)
  const [toDate, setToDate] = useState(to)

  const values = YEARS.map((y) => ({
    year: y
  }))

  return (
    <div>
      <span>From: </span>
      <Dropdown
        value={from}
        onChange={(e) => {
          setFromDate(e.value)
          filterChange(e.value, toDate)
        }}
        options={values}
        optionLabel="year"
        optionValue="year"
      />

      <span style={{ marginLeft: '1em' }}>To: </span>
      <Dropdown
        value={to}
        onChange={(e) => {
          setToDate(e.value)
          filterChange(fromDate, e.value)
        }}
        options={values}
        optionLabel="year"
        optionValue="year"
      />
    </div>
  )
}
