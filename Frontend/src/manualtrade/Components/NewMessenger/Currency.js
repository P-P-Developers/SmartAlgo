import React, { useEffect, useState, useContext } from 'react'

import { getScriptData, getStrategyData, getServiceData, getPanelKey } from '../../ApiCalls/Api.service'
import { ContextCreate } from "./MainComponent"


const Currency = () => {

  const [scriptdata, SetScriptdata] = useState('')

  // const { contextdata } = useContext(ContextCreate)


  // const [scriptname, SetScriptname] = useState('')
  const [scriptSeg, SetScriptSeg] = useState('')
  const [stretegydata, SetStretegydata] = useState('')
  const [strategy, setStrategy] = useState('')
  const [panelKey, setPanelKey] = useState("")
  const [diffrence, setDiffrence] = useState('')

  //---

  const [servicedata, SetServicedata] = useState('')
  const [selectCatagoryid, SetSelectCatagoryId] = useState('')
  const [scriptname, SetScriptname] = useState('')
  const [lot, setLot] = useState('')
  const [shares, setShares] = useState("")
  const [tradeType, setTradeType] = useState('')
  const [EntryPrice, SetEntryPrice] = useState('')
  const [EntryPriceBA, SetEntryPriceBA] = useState('')
  const [strategyErr, setStrategyErr] = useState('')

  const [target2, setTarget2] = useState('')
    const [target1, setTarget1] = useState('')

    const [stoploss, setStopLoss] = useState('')
  const [srefix, setSrefix] = useState('')
  const [prefix, setPrefix] = useState('')

  // ---------
  const [ScriptDataErr, setScriptDataErr] = useState('')
  const [ScriptnameErr, SetScriptnameErr] = useState('')
  const [lotErr, setLotErr] = useState('')
  const [tradeTypeErr, setTradeTypeErr] = useState('')
  const [EntryPriceErr, SetEntryPriceErr] = useState('')
  const [EntryPriceBAErr, SetEntryPriceBAErr] = useState('')
  const [sharesErr, setSharesErr] = useState('')


  const [selectCatagoryid1, SetSelectCatagoryId1] = useState('')
  const [scriptname1, SetScriptname1] = useState('')
  const [lot1, setLot1] = useState('')
  const [shares1, setShares1] = useState("")

  const [sharesErr1, setSharesErr1] = useState("")
  const [tradeType1, setTradeType1] = useState('')
  const [EntryPrice1, SetEntryPrice1] = useState('')
  const [EntryPriceBA1, SetEntryPriceBA1] = useState('')
  const [ScriptDataErr1, setScriptDataErr1] = useState('')
  //const [servicedata, SetServicedata] = useState('')

  const [ScriptnameErr1, SetScriptnameErr1] = useState('')
  const [lotErr1, setLotErr1] = useState('')
  const [tradeTypeErr1, setTradeTypeErr1] = useState('')
  const [EntryPriceErr1, SetEntryPriceErr1] = useState('')
  const [EntryPriceBAErr1, SetEntryPriceBAErr1] = useState('')
  const [diffrenceErr, setDiffrenceErr] = useState('')

  //--- 




  //  local Storage
  const admin_token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const getPanelKeys = async () => {
    const response = await getPanelKey(admin_token)
    if (response.status) {
      setPanelKey(response.data.PanelKey[0].panel_key);

    }
  }
  const GetScriptDataFunction = async () => {
    const response = await getScriptData(admin_token)
    if (response.status) {
      SetScriptdata(response.data.category)
    }



  }

  const GetStrategyDataFunction = async (e) => {
    const response = await getStrategyData(admin_token)
    if (response.status) {
      SetStretegydata(response.data.strategy)
    }
  }

  const GetServiceDataFunction = async (e) => {
    const data = { adminId: adminId, id: selectCatagoryid }

    const response = await getServiceData(data, admin_token)
    if (response.status) {
      SetServicedata(response.data.services)
    }
  }

  useEffect(() => {
    GetScriptDataFunction()
    GetStrategyDataFunction()
    getPanelKeys()

  }, [])


  useEffect(() => {
    GetServiceDataFunction()


    let datra = scriptdata && scriptdata.filter((x) => {
      if ((selectCatagoryid) == parseInt(x.id)) {
        return x
      }
    })
    SetScriptSeg(datra && datra[0].segment)

    // console.log("datra", datra && datra[0].segment);
  }, [selectCatagoryid])





  const SubmitMakeCall = (e) => {

    // var request = `id:11@@@@@input_symbol: ${scriptname}  "@@@@@type: "{element.type}"  "@@@@@price: price
    // "@@@@@dt:1668504000@@@@@ qty_percent:100@@@@@order_type:Market@@@@@client_key: ${panelKey} "@@@@@exchange:NFO@@@@@product_type:MIS@@@@@strike:"element1.strike_price + "@@@@@segment:${selectCatagoryid}@@@@@option_type: element.option_type @@@@@expiry:" + expiryOnChange + "@@@@@strategy: ${strategy} "@@@@@sq_value:00.00@@@@@sl_value:00.00@@@@@tr_price:00.00@@@@@tsl:00.00@@@@@token:" + element1.put_token + "@@@@@chain:option_chain@@@@@demo:demo"`;

    e.preventDefault();

    if (selectCatagoryid == "") {
      alert("Please Select a Script  Type")
      return
    }
    if (scriptname == "") {
      alert("Please Select a Script Name")
      return
    }
    if (lot == '') {
      alert("Please Select a Lot Size")
      return
    }

    if (shares == "") {
      alert("Please Select a  Lot")
      return
    }
    if (tradeType == '') {
      alert("Please Select a Trade Type")
      return
    }

    if (EntryPrice == '') {
      alert("Please Select a Entry Price")
      return
    }
    if (EntryPriceBA == false) {
      alert("Please Select a Entry Price Below/Above")
      return
    }


    if (selectCatagoryid1 == "") {
      alert("Please Select a Script  Type")
      return
    }
    if (scriptname1 == "") {
      alert("Please Select a Script Name")
      return
    }
    if (lot1 == '') {
      alert("Please Select a Lot Size")
      return
    }

    if (shares1 == "") {
      alert("Please Select a  Lot")
      return
    }
    if (tradeType1 == '') {
      alert("Please Select a Trade Type")
      return
    }

    if (EntryPrice1 == '') {
      alert("Please Select a Entry Price")
      return
    }
    if (EntryPriceBA1 == false) {
      alert("Please Select a Entry Price Below/Above")
      return
    }

    if (diffrence == '') {
      alert("Please Set a Diffrence Value")
      return
    }
    if (strategy == "") {
      alert("Please Select a Strategy")
      return
    }
    if (target1 == "") {
      alert("Please Select a Target1")
      return
    }
    if (target2 == "") {
      alert("Please Select a Target2")
      return
    }
    if (stoploss == "") {
      alert("Please Select a Stop/Loss")
      return
    }
    if (prefix == "") {
      alert("Please Select a Prefix")
      return
    }
    if (srefix == "") {
      alert("Please Select a Suffix")
      return
    }




  }














  return (
    <div> <div className="table-responsive" >
      <table className="table  currency-table">
        <thead>
          <tr>
            <th>Script Type </th>
            <th >Script Name </th>
            <th >Lot Type</th>
            <th >No of Lot </th>
            <th >Type</th>
            <th >Entry Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select className="form-select" aria-label="Default select example" onChange={(e) => {
                SetSelectCatagoryId(e.target.value);
                setScriptDataErr('')
              }}>
                <option
                  name="none">Select Script Type</option>
                {scriptdata && scriptdata?.map((x, index) => {
                  return <option key={index} value={x.id}>{x.name}</option>
                })}
              </select>
              {ScriptDataErr ? <p style={{ color: "#ff8888", fontSize: "12px" }}> *{ScriptDataErr}</p> : ''}

            </td>
            <td>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { SetScriptname(e.target.value); SetScriptnameErr('') }}>
                <option selected>Select Script Name -</option>
                {
                  servicedata && servicedata.map((x) => {
                    return <option value={x.service}>{x.service}</option>
                  })
                }
              </select>
              {ScriptnameErr ? <p style={{ color: "#ff8888", fontSize: "12px" }}> *{ScriptnameErr}</p> : ''}

            </td>
            <td  >
              <label>1 Lot = </label>
              <input type="text" style={{ width: '100px' }} className="form-control " onChange={(e) => { setLot(e.target.value); setLotErr('') }} />
              {lotErr ? <p style={{ color: "#ff8888", fontSize: "10px" }}> *{lotErr}</p> : ''}

            </td>
            <td>
              <input type="text" className="form-control" onChange={(e) => { setShares(e.target.value); setSharesErr("") }} />
              {sharesErr ? <p style={{ color: "#ff8888" }}> *{sharesErr}</p> : ''}

            </td>
            <td>
              <select className="form-control" name="type1" onChange={(e) => { setTradeType(e.target.value); setTradeTypeErr('') }} >
                <option value="" selected disabled>Select Type</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
              {tradeTypeErr ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr}</p> : ''}

            </td>
            <td>
              <input type="text" className="form-control" onChange={(e) => { SetEntryPrice(e.target.value); SetEntryPriceErr('') }} /><br />
              <div className="row">
                <div className="col-sm-4 col-lg-4">
                  <div className="radio"><label><input type="radio" name="optradio" onChange={(e) => { SetEntryPriceBA(e.target.checked); SetEntryPriceBAErr('') }} checked />At</label>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-4 px-0">
                  <div className="radio"><label><input type="radio" name="optradio" onChange={(e) => { SetEntryPriceBA(e.target.checked); SetEntryPriceBAErr('') }} />Above</label>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-4 pe-0"><div className="radio"><label><input type="radio" name="optradio" onChange={(e) => { SetEntryPriceBA(e.target.checked); SetEntryPriceBAErr('') }} />Below</label>
                </div></div></div>
              {EntryPriceErr ? <p style={{ color: "#ff8888" }}> *{EntryPriceErr}</p> : ''}
              {EntryPriceBAErr ? <p style={{ color: "#ff8888" }}> *{EntryPriceBAErr}</p> : ''}
            </td>
          </tr>
          <tr>
            <td>
              <select className="form-select" aria-label="Default select example" onChange={(e) => {
                SetSelectCatagoryId1(e.target.value);
                setScriptDataErr1('')
              }}>
                <option
                  name="none">Select Script Type</option>
                {scriptdata && scriptdata?.map((x, index) => {
                  return <option key={index} value={x.id}>{x.name}</option>
                })}
              </select>
              {ScriptDataErr1 ? <p style={{ color: "#ff8888", fontSize: "12px" }}> *{ScriptDataErr1}</p> : ''}

            </td>

            <td>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { SetScriptname1(e.target.value); SetScriptnameErr1('') }}>
                <option selected>Select Script Name -</option>
                {
                  servicedata && servicedata.map((x) => {
                    return <option value={x.service}>{x.service}</option>
                  })
                }
              </select>
              {ScriptnameErr1 ? <p style={{ color: "#ff8888", fontSize: "12px" }}> *{ScriptnameErr1}</p> : ''}

            </td>
            <td >
              <label>1 Lot = </label>
              <input type="text" style={{ width: '100px' }} className="form-control " onChange={(e) => { setLot1(e.target.value); setLotErr1('') }} />
              {lotErr1 ? <p style={{ color: "#ff8888", fontSize: "10px" }}> *{lotErr1}</p> : ''}

            </td>
            <td>
              <input type="text" className="form-control" onChange={(e) => { setShares1(e.target.value); setSharesErr1("") }} />
              {sharesErr1 ? <p style={{ color: "#ff8888" }}> *{sharesErr1}</p> : ''}

            </td>
            <td>
              <select className="form-select" onChange={(e) => { setTradeType1(e.target.value); setTradeTypeErr1('') }}>
                <option value="" selected disabled>Select Type</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
              {tradeTypeErr1 ? <p style={{ color: "#ff8888" }}> *{tradeTypeErr1}</p> : ''}

            </td>
            <td>
              <input type="text" name="entry_price2" className="form-control" onChange={(e) => { SetEntryPrice1(e.target.value); SetEntryPriceErr1('') }} checked /><br />
              <div className="row">
                <div className="col-sm-4 col-lg-4">
                  <div className="radio"><label><input type="radio" name="optradio1" onChange={(e) => { SetEntryPriceBA1(e.target.checked); SetEntryPriceBAErr1('') }} checked />At</label>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-4 px-0">
                  <div className="radio"><label><input type="radio" name="optradio1" onChange={(e) => { SetEntryPriceBA1(e.target.checked); SetEntryPriceBAErr1('') }} />Above</label>
                  </div>
                </div>
                <div className="col-sm-4 col-lg-4 pe-0"><div className="radio"><label><input type="radio" name="optradio1" onChange={(e) => { SetEntryPriceBA(e.target.checked); SetEntryPriceBAErr('') }} />Below</label>
                </div></div></div>
              {EntryPriceErr1 ? <p style={{ color: "#ff8888" }}> *{EntryPriceErr1}</p> : ''}
              {EntryPriceBAErr1 ? <p style={{ color: "#ff8888" }}> *{EntryPriceBAErr1}</p> : ''}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      <div>
        <div className="row bg-gray mt-5">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Difference-</label>
              <input type="text" className="form-control" onChange={(e) => { setDiffrence(e.target.value); setDiffrenceErr('') }} />
              {diffrenceErr ? <p style={{ color: "#ff8888" }}> *{diffrenceErr}</p> : ''}

            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">
                Call Type -</label>
              <label for="exampleFormControlSelect1">Select Strategy -</label>
              <select className="form-select" aria-label="Default select example" onChange={(e) => { setStrategy(e.target.value); setStrategyErr('') }}>
                <option selected>Select Strategy</option>
                {
                  stretegydata && stretegydata.map((x) => {
                    return <option value={x.name}>{x.name}</option>
                  })
                }
              </select>
              {strategyErr ? <p style={{ color: "#ff8888" }}> *{strategyErr}</p> : ''}

            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Target 1</label>
              <input type="text" className="form-control" onChange={(e) => { setTarget1(e.target.value); }}/>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">Target 2</label>
              <input type="text" className="form-control" onChange={(e) => { setTarget2(e.target.value); }}/>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">Stop Loss</label>
              <input type="text" className="form-control" onChange={(e) => { setStopLoss(e.target.value); }}/>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <button type="submit" className="btn btn-fill w-auto">Generate</button>
        </div>
      </div>

      <hr />

      <div className='row mt-5 bg-gray'>
        <div className='col-md-6'>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Prefix -</label>
            <select className="form-select" aria-label="Default select example"   onChange={(e) => { setPrefix(e.target.value); }}>
              <option selected disabled>Select Prefix</option>
              <option value="equity">Equity</option>
              <option value="commodity">Commodity</option>
              <option value="mcx">MCX</option>
            </select>


          </div>
        </div>
        <div className='col-md-6'>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Shift + Enter to Send (Character - 9 )</label>
            <input type="text" className="form-control" placeholder='Suffix' onChange={(e) => { setSrefix(e.target.value); }}/>
          </div>
        </div>
        <div className='col-md-12'>
          <textarea className='form-control'></textarea>
        </div>

      </div>
      <div className='row'>
        <div className='col-md-12'>
          <button type="submit" className="btn btn-fill w-auto" onClick={(e) => SubmitMakeCall(e)}>Save</button>

        </div>
      </div>

    </div>
  )
}

export default Currency