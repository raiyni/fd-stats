import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { YEARS } from './../../data'
import axios from 'axios'

const initialState = {
  store: [],
  from: 2008,
  to: 2020,
  loading: true
}

const fetchYear = createAsyncThunk(
  'standings/fetchYear',
  async (year, thunkAPI) => {
    const response = await axios.get(`/data/standings/${year}.json`)
    return response.data
  }
)

export const fetchStandings = async (dispatch) => {
  await Promise.all(YEARS.map((year) => dispatch(fetchYear(year))))
  dispatch(slice.actions.finishedLoading())
}

const slice = createSlice({
  name: 'standings',
  initialState,
  reducers: {
    setYears: (state, action) => {
      state.from = action.payload.from
      state.to = action.payload.to
    },
    finishedLoading: (state, action) => {
      state.loading = false
    }
  },
  extraReducers: {
    [fetchYear.fulfilled]: (state, action) => {
      Array.prototype.push.apply(
        state.store,
        action.payload.map((row) => {
          return {
            year: action.meta.arg,
            pointsFor: row.pointsFor.value,
            pointsAgainst: row.pointsAgainst.value,
            wins: row.recordOverall.wins || 0,
            losses: row.recordOverall.losses || 0,
            playoffWins: row.recordPostseason.wins || 0,
            playoffLosses: row.recordPostseason.losses || 0,
            championships: row.recordOverall.rank === 1 ? 1 : 0,
            owner: row.owners[0].displayName,
            id: row.owners[0].id
          }
        })
      )
    }
  }
})

export const { setYears } = slice.actions

export default slice.reducer
