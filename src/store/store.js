import { configureStore } from "@reduxjs/toolkit";  
import authReducer from "./authSlice";
import courseReducer from './courseSlice'
import tradeReducer from './tradeSlice'
import quizReducer from './quizSlice'
import langReducer from './langSlice'

 const store = configureStore({
    reducer: {
        auth: authReducer,
        course:courseReducer,
        trade:tradeReducer,
        quiz:quizReducer,
        lang:langReducer
    }
})

export default store