
import * as Config from "../../common/Config";
import axios from "axios";


export function GetAliceTokenAndID() {
  
    return axios.get(`${Config.base_url}api/alicebluetoken` ,  {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {},
    })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            return error.response
        })
}








