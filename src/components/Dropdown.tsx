import { ChangeEvent, memo } from "react";
import PropTypes from 'prop-types';
const Dropdown = ({
    value='' ,
    options=[] as {value:string,label: string}[] ,
    handleDropdownValueChange = (e: ChangeEvent<HTMLSelectElement>) => {} 
    }) => {
    return (
        <>
            <select value={value} style={{margin: '8px'}}  onChange={handleDropdownValueChange} name="drop-down" id="drop-down">
                {
                    options.map((e)=>(<option key={e.value} value={e.value}> { e.label} </option>))
                }
            </select>
        </>
    )
}

Dropdown.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({label: PropTypes.string,value:PropTypes.string})),
}
export default memo(Dropdown);