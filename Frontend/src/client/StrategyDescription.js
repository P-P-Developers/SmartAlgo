import React, { useState, useEffect } from "react";
import _ from 'lodash';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { dateFormate } from "../common/CommonDateFormate";
import * as Config from "../common/Config";
import Accordion from 'react-bootstrap/Accordion';


const StrategyDescription = () => {

    const [getStrategy, setGetStrategy] = useState([])

    console.log("getStrategy", getStrategy);

    const client_token = localStorage.getItem("client_token");
    const client_id = localStorage.getItem("client_id");
    // console.log("client_id", client_id);

    const getStrategyApi = () => {

        var config = {
            method: 'post',
            url: `${Config.base_url}client/strategy/getdescription`,
            headers: {
                'x-access-token': client_token,
            },
            data: {
                "id_client": client_id
            }
        };

        axios(config)
            .then(function (response) {
                // console.log("res", response.data.description);
                setGetStrategy(response.data.description)
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    useEffect(() => {
        getStrategyApi()
    }, [])


    return (
        <>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <section className="content-header">
                                <h5>
                                    <i />
                                    Strategy Description
                                    <small />
                                </h5>
                            </section>

                            <section className="contact-form  bg-light-white pt-100 pb-100">
                                <div className="container">
                                    <div className="row" style={{ marginTop: 30 }}>
                                        <div id="error_file" className="text-danger" />
                                        <div className="col-lg-12">

                                            <div className="card-body">
                                                {getStrategy && getStrategy.map((item, index) => {
                                                    return <>
                                                        <Accordion defaultActiveKey="0" className="mt-1">
                                                            <Accordion.Item eventKey={index + 1}>
                                                                <Accordion.Header><b>{item.strategy}</b></Accordion.Header>
                                                                <Accordion.Body>
                                                                    {item.description}
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    </>
                                                })}

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="content">
                <div className="row">
                    <div className="col-md-12 mt-5">
                        <div className="card">
                            <div className="card-header">
                                <div className="row d-flex align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="title" style={{ marginBottom: "0px" }}>
                                            Strategy Description
                                        </h5>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="back-button text-right d-flex justify-content-end">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body">
                                {getStrategy && getStrategy.map((item, index) => {
                                    return <>
                                        <Accordion defaultActiveKey="0"  className="mt-1">
                                            <Accordion.Item eventKey={index + 1}>
                                                <Accordion.Header><b>{item.strategy}</b></Accordion.Header>
                                                <Accordion.Body>
                                                    <b>{item.description}</b>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </>
                                })}

                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
};

export default StrategyDescription;
