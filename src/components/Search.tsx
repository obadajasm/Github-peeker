import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DropdwonOptions } from '../consts/dropdwonOptions';
import { fetchRepos, fetchUsers, resetState } from '../features/github/githubSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { debounce } from '../utils/debounce';
import Dropdown from './Dropdown';
import ReposList from './RepositoryList';
import UserLists from './UsersList';
import Wrapper from './Wrapper';

const Search = () => {
    const [dropValue, setDropValue] = useState<'users' | 'repositories'>('users');
    const [userInput, setUserInput] = useState('');
    const [page, setPage] = useState(1);
    const loader = useRef(null);

    const status = useAppSelector((state) => state.github.status);
    const error = useAppSelector(state => state.github.error)

    const dispatch = useAppDispatch();
    let abortController = new AbortController();

    const container = {
        display: "flex",
        justifyContent: "end",
        flexDirection: 'column',
        flex: 1,
        paddingTop: '16px'
    };

    const handleDropdownValueChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setDropValue(value as any)
        if (userInput.length > 2) {
            dispatchFetchACFromUserInput(userInput, value, page);
        } else {
            dispatch(resetState())
        }
    }

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {

        const { value } = e.target;
        setUserInput(value);

        if (value.length === 0) {
            dispatch(resetState());
            return;
        }

        debounce(() => {
            if (e.target.value !== value) {
                abortController.abort();
                return;
            }
            dispatchFetchACFromUserInput(value, dropValue, page)

        }, 1000)();
    }
    const dispatchFetchACFromUserInput = useCallback((value: string, dropDwonValue: string, page: number) => {
        let ac = fetchUsers({
            query: value,
            signal: abortController.signal,
            page
        });

        if (dropDwonValue === 'repositories') {
            ac = fetchRepos({
                query: value,
                signal: abortController.signal,
                page
            });
        }
        dispatch(ac);
    }, [abortController, dispatch])


    const handleObserver = useCallback((entries: any) => {
        if (status === 'loading') {
            return;
        }
        const target = entries[0];
        if (target.isIntersecting) {
            const newPage = page + 1;
            setPage(newPage);
            dispatchFetchACFromUserInput(userInput, dropValue, newPage);
        }

    }, [dispatchFetchACFromUserInput, dropValue, page, status, userInput]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    return (
        <Wrapper>
            <div style={container as React.CSSProperties}>
                <div>
                    <img
                        alt="Github Icon"
                        style={{ height: "30px", width: "30px" }}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNUxrAed1mhZqZFBh8ud1zLo0uXeoqll46zUuyinw&s"
                    />
                    <span>github Search something</span>
                </div>
                <div>
                    <input value={userInput} onChange={(e) => handleInput(e)} type="text" />
                    <Dropdown options={DropdwonOptions} value={dropValue} handleDropdownValueChange={handleDropdownValueChange} />
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'center', flex: 1, height: '100%' }}>
                {
                    error ? <p style={{ color: 'red', fontSize: '30px' }}> {error} </p>
                        : dropValue === 'users' ? <UserLists loader={loader} /> : <ReposList loader={loader} />
                }
            </div>
        </Wrapper>
    );
};

export default Search;
