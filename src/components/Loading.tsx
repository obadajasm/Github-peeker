import { useAppSelector } from "../store/hooks";

const Loading = ({ loader }: { loader: React.RefObject<HTMLDivElement> }) => {

    const status = useAppSelector(state => state.github.status);
    const isLoading = status === 'loading';
    const msg = isLoading ? 'loading ....' : '';
    return (
        <>
            {!isLoading && < div ref={loader}> {msg} </div>}
        </>
    )
}

export default Loading;