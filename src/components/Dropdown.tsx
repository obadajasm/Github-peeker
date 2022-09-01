import { ChangeEvent, memo } from "react";

type DropDownProp = {
    value: string,
    options: { value: string, label: string }[],
    handleDropdownValueChange: (e: ChangeEvent<HTMLSelectElement>) => void
};
const Dropdown = ({
    value,
    options,
    handleDropdownValueChange,
}: DropDownProp) => {
    return (
        <>
            <select value={value} style={{ margin: '8px' }} onChange={handleDropdownValueChange} name="drop-down" id="drop-down">
                {
                    options.map((e) => (<option key={e.value} value={e.value}> {e.label} </option>))
                }
            </select>
        </>
    )
}

export default memo(Dropdown);