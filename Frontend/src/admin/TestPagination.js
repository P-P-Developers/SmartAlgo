import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

const MyTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [clientData, setClientData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const loadData = () => {
        axios({
            method: 'post',
            url: `https://trade.startalgo.com:3095/admin/client_limit`,
            data: {
                page: currentPage,
                limit: pageSize,
            },
        })
            .then(function (response) {
                setClientData(response.data.client);
                setTotalCount(response.data.totalCount);
            })
            .catch(function (error) {
                console.log('Error:', error);
            });
    };

    useEffect(() => {
        loadData();
    }, [pageSize, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (e) => {
        const size = parseInt(e.target.value);
        setPageSize(size);
        // setCurrentPage(1);
    };

    const columns = [
        { name: 'index', selector: (row, index) => index + 1, sortable: true },
        { name: 'ID', selector: 'id', sortable: true },
        { name: 'Name', selector: 'full_name', sortable: true },
        { name: 'Price', selector: 'email', sortable: true },
        { name: 'mobile', selector: 'mobile', sortable: true },
    ];

    const CustomPagination = () => {
        const totalPages = Math.ceil(totalCount / pageSize);
        const showPagination = totalPages > 3;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        if (!showPagination) {
            return null;
            // Hide pagination when there are three or fewer pages
        }

        let displayedPages;

        const currentPageIndex = currentPage - 1;
        if (currentPageIndex + 3 > totalPages) {
            displayedPages = pageNumbers.slice(-3); // Show last three pages
        } else {
            displayedPages = pageNumbers.slice(currentPageIndex, currentPageIndex + 3);
        }




        return (
            <nav aria-label="Page navigation example">
                <select value={pageSize} onChange={(e) => handlePageSizeChange(e)}>
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option> {/* Add custom row per page value */}
                </select>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a
                            className="page-link"
                            tabIndex="-1"
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </a>
                    </li>
                    {displayedPages.map((page) => (
                        <li
                            className={`page-item ${page === currentPage ? 'active' : ''}`}
                            key={page}
                        >
                            <a
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </a>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row d-flex align-items-center">
                                <div className="col-md-6">
                                    <h5 className="title" style={{ marginBottom: '0px' }}>
                                        Add Strategy
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">

                            <DataTableExtensions
                                columns={columns}
                                data={clientData}
                                export={false}
                                print={false}
                            >
                                <DataTable

                                    pagination
                                    paginationComponent={CustomPagination}
                                    // paginationPerPage={pageSize}
                                    // paginationRowsPerPageOptions={[10, 50, 100]}
                                />
                            </DataTableExtensions>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTable;
