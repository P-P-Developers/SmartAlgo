
import * as Config from "../../common/Config";
import axios from "axios";

// const accesstoken = localStorage.getItem("user_token");


export function getScriptData(token) {
    return axios.get(`${Config.base_url}smartalgo/category`, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
      })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

//  Get Strategy

export function getServiceData(data, token) {
    return axios.post(`https://api.smartalgo.in:3001/makecall/services`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}


export function getStrategyData(token) {
    return axios.get(`${Config.base_url}admin/strategy

    `, {
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}
// get panel key name

export function getPanelKey(token) {
    return axios.get(`${Config.base_url}smartalgo/panelkey

    `, {
        headers: {
            //'x-access-token': token,
            'Content-Type': 'application/json'
        },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })

}
// get panel key name

export function BrokerSignalsApi(data) {
    return axios.post(`${Config.base_url}broker-signals`, data, {
        // return axios.post(`https://testbrokerserver.pnpuniverse.com/broker-signals`, data ,{
        headers: {
            // 'x-access-token': token,
            'Content-Type': 'text/plain'
        },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })

}



// get token pass socket
export function gettokenbysocket(data) {
    return axios.post(`https://api.smartalgo.in:3001/getinstrumenttoken`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

//Get All Strike Price

export function getAllStrikePriceApi(data) {
    return axios.post(`https://api.smartalgo.in:3001/getAllStrikePriceSymbol`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

// Get Expiry Manual Trading
export function getexpirymanualtrade(data) {
    return axios.post(`https://api.smartalgo.in:3001/manualtradegetexpiry`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

// Get Below / Above Data
export function GetBelowAboveData(data) {
    return axios.post(`${Config.base_url}manual/getdataAboveAndBelow`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}


export function DeleteBelowAboveData(data) {
    return axios.post(`${Config.base_url}manual/deletedataAboveAndBelow`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}




export function UpdateBelowAboveData(data) {
    return axios.post(`${Config.base_url}manual/updatedataAboveAndBelow`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}


// --------------------   For Make Call ----------------------------------------------


//  Request For AT Price 
export function AtEntryPriceRequest(data) {
    return axios.post(`${Config.broker_signal_url}`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

//  Request For Below Price 

export function BelowPriceRequest(data) {
    return axios.post(`${Config.base_url}manual/placeOrderExcuted_below`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

//  Request For Above Price 
export function AbovePriceRequest(data) {
    return axios.post(`${Config.base_url}manual/placeOrderExcuted_above`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}


//  Request For Range Price 
export function RangePriceRequest(data) {
    return axios.post(`${Config.base_url}manual/placeOrderExcuted_range`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}

//  Request For update make call trade update target price and stoploss price 
export function UpdatemakecallatRequest(data) {
    return axios.post(`${Config.base_url}manual/UpdatemakecallatRequest`, data, {
        // headers: {
        //     'x-access-token': token,
        //     'Content-Type': 'application/json'
        // },
        data: {},
    })
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.response
        })
}



