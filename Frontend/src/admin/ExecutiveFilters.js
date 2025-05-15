import React from 'react'

const ExecutiveFilters = () => {
    return (
        <div>
            <b>SYMBOLS</b>
            <select
                name="symbols_filter"
                className="form-control spacing"
                style={{ width: "100px" }}
                // onChange={(e) => SymbolsFilter(e)}
            >
                {/* <option value="All" >All</option> */}
                <option value="BANKNIFTY" selected>BANKNIFTY</option>
                <option value="NIFTY">NIFTY</option>

                {/* {uniqueArr && uniqueArr.map((x) => {
        return <option value={x}>{x}</option>
      })} */}
            </select>
        </div>
    )
}

export default ExecutiveFilters