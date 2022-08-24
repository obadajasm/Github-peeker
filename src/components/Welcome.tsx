import { Link, useNavigate } from "react-router-dom";
import Wrapper from "./Wrapper";

const Welcome = () => {

    const navigate = useNavigate();
    return (
        <Wrapper>

            <p>Hi there</p>
            <Link to="/search">tap here to navigate to the search</Link>
            <div style={{ margin: '8px' }}>
                <span> Or press this btn </span>
                <button data-testid="navBtn" onClick={() => navigate('/search')}>
                    Go to Search
                </button>
            </div>
        </Wrapper>
    )
}

export default Welcome;