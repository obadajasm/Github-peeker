import { createSlice } from "@reduxjs/toolkit";
import { Repository } from "../../models/repository";
import { ApiResponse } from "../../models/response";
import { User } from "../../models/user";
import { GithubService } from "../../services/githubService";
import { AppThunk } from "../../store/indext";



type HistoryType = { [key: string]: ApiResponse<User> | ApiResponse<Repository> };
const history: HistoryType = {};


const initialState = {
  history,
  status: "idle",
  error: '',
  users: {} as ApiResponse<User> | undefined,
  repos: {} as ApiResponse<Repository>| undefined,
};

export const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {
    setStatus(state, { payload }) {
      state.status = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    resetState(state) {
      //reset all but keep the history
      Object.assign(state, {
        status: "idle",
        error: '',
        users: [] as User[] | undefined,
        repos: [] as Repository[] | undefined,
      })
    },
    setUsers(state, action) {
      
      state.users = action.payload;
    },
    setHistory(state, action) {
      state.history= {
        [action.payload.key]: action.payload.value,
        ...state.history
      }
    //   console.log(action,state,state.history);
      
    //   Object.assign(state.history, { [action.payload.key]: action.payload.value });
    },
    paginateUsers(state, { payload }) {
      state.users = {
        total_count: state.users?.total_count + payload.total_count,
        items: [...(state.users?.items??[]),...payload.users?.items]
      }
    },
    setRepos(state, action) {
      state.repos = action.payload
    },
    paginateRepos(state, { payload }) {
      state.repos = {
        total_count: state.repos?.total_count + payload.total_count,
        items: [...(state.repos?.items??[]),...payload.repos?.items]
      }
    },
  },
});

export const { setUsers, paginateUsers, setRepos, paginateRepos, setStatus, setError, resetState, setHistory } = githubSlice.actions;

export const selectUsers = (state: any) => state.github.users;


export const fetchRepos =
  ({ query, signal, page }: { query: string; signal: AbortSignal, page: number }): AppThunk =>
    async (dispatch, getState) => {
      try {
        const state= getState().github;
        const requestKey = `repos-${page}-${query}`;
        const totalCount= state.repos?.total_count ;
        const totalLocalCount= state.repos?.items?.length;

        if(totalCount !== undefined && totalLocalCount !==undefined && totalCount === totalLocalCount)  {
          return;
        }

        dispatch(setError(''));
        dispatch(setStatus('loading'))

        let response = state.history[requestKey] as ApiResponse<Repository>;
        console.log('histiry', response);
        
        if (!response) {
          response = await GithubService.getRepos(query, signal, page);
        }
        if (page > 1) {
          dispatch(paginateRepos(response));
        } else {
          dispatch(setRepos(response));
        }

        dispatch(setStatus('idle'))
        dispatch(setHistory({
          key: requestKey,
          value: response
        }))


      } catch (error) {

        dispatch(setError((error as any)?.message ?? 'something went wrong!'))
        throw error;
      }
    };


export const fetchUsers =
  ({ query, signal, page }: { query: string; signal: AbortSignal, page: number }): AppThunk =>
    async (dispatch, getState) => {
      try {
        const state= getState().github;
        const requestKey = `users-${page}-${query}`;
        const totalCount= state.users?.total_count ;
        const totalLocalCount= state.users?.items?.length;

        if(totalCount !== undefined && totalLocalCount !==undefined && totalCount === totalLocalCount)  {
          return;
        }
        dispatch(setError(''));
        dispatch(setStatus('loading'))

        let response = state.history[requestKey] as ApiResponse<User>;
        
        if (!response) {
          response = await GithubService.getUsers(query, signal, page);
        }
        if (page > 1) {
          dispatch(paginateUsers(response));

        } else {
          dispatch(setUsers(response));

        }

        dispatch(setStatus('idle'))
        dispatch(setHistory({
          key: requestKey,
          value: response
        }))

      } catch (error) {
        dispatch(setError((error as any)?.message ?? 'something went wrong!'))
        throw error;
      }
    };


export default githubSlice.reducer;
