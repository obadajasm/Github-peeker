import { createSlice, current, ThunkDispatch } from "@reduxjs/toolkit";
import { Repository } from "../../models/repository";
import { ApiResponse } from "../../models/response";
import { User } from "../../models/user";
import { GithubService } from "../../services/githubService";
import { AppThunk } from "../../store/indext";
import { paginationHelper } from "../../utils";



export type HistoryType = { [key: string]: ApiResponse<User> | ApiResponse<Repository> };
export const history: HistoryType = {};


const initialState = {
  history,
  status: "idle",
  error: '',
  users: {} as ApiResponse<User> | undefined,
  repos: {} as ApiResponse<Repository> | undefined,
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
      state.history = {
        [action.payload.key]: action.payload.value,
        ...state.history
      }
    },
    paginateUsers(state, { payload }) {

      state.users = paginationHelper('users', state, payload);
    },
    setRepos(state, action) {
      state.repos = action.payload
    },
    paginateRepos(state, { payload }) {

      state.users = paginationHelper('repos', current(state), payload);
    },
  },
});


export const { setUsers, paginateUsers, setRepos, paginateRepos, setStatus, setError, resetState, setHistory } = githubSlice.actions;


export const fetchUsers =
  ({ query, signal, page }: { query: string; signal: AbortSignal, page: number }): AppThunk =>
    async (dispatch, getState) => {

      handleDataFetch<ApiResponse<User>>({
        query, page, type: 'users', state: getState().github, dispatch,
        cb: async (response: any) => {

          if (!response) {
            response = await GithubService.getUsers(query, signal, page);
          }
          if (page > 1) {
            dispatch(paginateUsers(response));
          } else {
            dispatch(setUsers(response));
          }
        }
      });
    };
export const fetchRepos =
  ({ query, signal, page }: { query: string; signal: AbortSignal, page: number }): AppThunk =>
    async (dispatch, getState) => {

      handleDataFetch<ApiResponse<Repository>>({
        query, page, type: 'repos', state: getState().github, dispatch,
        cb: async (response: any) => {

          if (!response) {
            response = await GithubService.getRepos(query, signal, page);
          }
          if (page > 1) {
            dispatch(paginateRepos(response));
          } else {
            dispatch(setRepos(response));
          }
        }
      });
    };



export const handleDataFetch = async <T>({ query, page, type, cb, state, dispatch }:
  { query: string, page: number, type: 'repos' | 'users', cb: Function, state: any, dispatch: any }) => {
  try {
    const requestKey = `${type}-${page}-${query}`;
    const totalCount = state[type]?.total_count;
    const totalLocalCount = state[type]?.items?.length;

    if (totalCount !== undefined && totalLocalCount !== undefined && totalCount === totalLocalCount) {
      return;
    }

    dispatch(setError(''));
    dispatch(setStatus('loading'))
    let response;
    if (Object.hasOwn(state.history, requestKey)) {
      response = state.history[requestKey] as unknown as T;
    }

    await cb(response);
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
