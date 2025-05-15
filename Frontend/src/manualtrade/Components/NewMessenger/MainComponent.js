import React, { useEffect, useState , createContext } from 'react'
import MakeCalls from "./MakeCalls"
import PairCalls from "./PairCalls"
import Currency from "./Currency"

import { getScriptData, getStrategyData, getServiceData, getPanelKey } from '../../ApiCalls/Api.service'
export const contextCreate = createContext();

export const  ContextCreate = createContext();
const MainComponent = () => {
  
  const admin_token = localStorage.getItem("token");


  const [panelKey, setPanelKey] = useState("")
  const [scriptdata, SetScriptdata] = useState('')
  const [stretegydata, SetStretegydata] = useState('')
  const [servicedata, SetServicedata] = useState('')


  const getPanelKeys = async () => {
    const response = await getPanelKey(admin_token)
    if (response.status) {

      console.log("log panel key -",response);
      setPanelKey(response.data.PanelKey[0].panel_key);

    }
  }
  const GetScriptDataFunction = async () => {
    const response = await getScriptData(admin_token)
    console.log("script" ,response );
    if (response.status) {
      SetScriptdata(response.data.category)
    }



  }

  const GetStrategyDataFunction = async (e) => {
    const response = await getStrategyData(admin_token)
    console.log("getStrategyData" , response);
    if (response.status) {
      SetStretegydata(response.data.strategy)
    }
  }

  // const GetServiceDataFunction = async (e) => {
  //   const data = { adminId: adminId, id: selectCatagoryid }

  //   const response = await getServiceData(data, admin_token)
  //   if (response.status) {
  //     SetServicedata(response.data.services)
  //   }
  // }


  useEffect(() => {
    GetScriptDataFunction()
    GetStrategyDataFunction()
    getPanelKeys()

  }, [])





  return (


    <div className='manual'>
      <div className='content'>
        <div className='card-dark'>
          <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-home-tab" data-toggle="pill" data-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Make Call</button>
            </li>
            {/* <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-profile-tab" data-toggle="pill" data-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Pair Calls</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-contact-tab" data-toggle="pill" data-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Currency</button>
            </li> */}
          </ul>
            <div className="tab-content" id="pills-tabContent">

       {/* //   <ContextCreate.Provider value={{ servicedata, stretegydata, scriptdata, panelKey }}> */}
              <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                <MakeCalls />
              </div>
              {/* <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                <PairCalls />
                </div>
              <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab"><Currency /></div> */}

          {/* </ContextCreate.Provider> */}
            </div>
        </div>
      </div>
    </div>
  )
}

export default MainComponent