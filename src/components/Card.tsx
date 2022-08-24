import styled from "styled-components";

const StyledCard = styled.div`
    width: 160px;
    height: 200px;
    border: 1px solid palevioletred;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 8px;
`;

const SmallP= styled.p`
        margin:2px;
`

const Card = ({ title = '', secondary='', imgSrc = '', info ={} } :
{info?: Record<string,string | number>,title: string,secondary?: string,imgSrc?: string}) => {
    return (
        <StyledCard>
          {imgSrc &&  <img src={imgSrc} alt={title} style={{ width: '120px', height: '120px' }} />}
            <SmallP>{title}</SmallP>
            <SmallP> {secondary}</SmallP>
            { Object.entries(info).map(([key,val]) => <SmallP key={key} >{key}: {val} </SmallP>) }
        </StyledCard>
    );
}
export default Card;