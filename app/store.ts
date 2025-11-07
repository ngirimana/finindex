import { configureStore } from '@reduxjs/toolkit'
import { finApi } from './services/finApi'

export const store = configureStore({
  reducer: {
    [finApi.reducerPath]: finApi.reducer,
  },
  middleware: (gDM) => gDM().concat(finApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
