import { Repository } from '../../models/repository';
import { ApiResponse } from '../../models/response';
import { User } from '../../models/user';
import counterReducer, {
    setStatus,
    history
} from './githubSlice';

describe('counter reducer', () => {
   
const initialState = {
    history,
    status: "idle",
    error: '',
    users: {} as ApiResponse<User> | undefined,
    repos: {} as ApiResponse<Repository>| undefined,
  };
  
    it('should handle initial state', () => {
        expect(counterReducer(undefined, { type: 'unknown' }))
            .toEqual(
                { history: {}, status: 'idle', error: '', users: {}, repos: {} }
            );
    });


    it('should set status', () => {
        expect(counterReducer(initialState,setStatus('loading')))
            .toEqual(
                { history: {}, status: 'loading', error: '', users: {}, repos: {} }
            );
    });

});