import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";
import { userReducer, studentReducer } from "./slices";
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    user:userReducer,
    student:studentReducer,
  },
  middleware:(getDefaultMiddleware)=>[...getDefaultMiddleware({serializableCheck:false}),sagaMiddleware]
})

export type RootState = ReturnType<typeof store.getState>

sagaMiddleware.run(rootSaga);
