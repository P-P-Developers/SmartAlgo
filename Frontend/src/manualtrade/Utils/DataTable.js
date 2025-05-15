import React from 'react'
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

const DataTableComponent = ( props) => {
const {Data, Columns, Options}  = props
    
    const customStyles = {


        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: "#e9ecf0",
            },
        },
        headCells: {
            style: {
                fontWeight: '400',
                fontSize: "12px",
                // margin:' 19px 0px',
                background: '#d9ecff',

                color: '#607D8B',
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#e9ecf0',
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    fontWeight: '400',
                    fontSize: "12px",

                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: '#e9ecf0',
                },
            },
        },
    };

    return (
        <div><DataTableExtensions
            columns={Columns}
            data={Data}
            export={false}
            print={false}
        >
            <DataTable
                fixedHeader
                fixedHeaderScrollHeight="700px"
                noHeader
                defaultSortField="id"
                defaultSortAsc={false}
                
                customStyles={customStyles}
                highlightOnHover
                Options
            />
        </DataTableExtensions></div>
    )
}

export default DataTableComponent