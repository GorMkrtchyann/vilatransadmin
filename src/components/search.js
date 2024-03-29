import {IconRefresh, IconSearch} from "@tabler/icons-react";
import {useState} from "react";


export const Search = ({onSearch, onRefresh, refreshLoading}) => {
    const [value, setValue] = useState(null)

    return(
        <div className={'search'}>
            <IconRefresh className={refreshLoading ? 'rotate' : ''} style={{cursor: "pointer"}} onClick={onRefresh}/>
            <div className={'search__input'}>
                <input type="text" placeholder={'Search...'} onChange={(e) => setValue(e.target.value)}/>
                <IconSearch style={{cursor: "pointer"}} onClick={() => onSearch(value.toLowerCase())}/>
            </div>
        </div>
    )
}