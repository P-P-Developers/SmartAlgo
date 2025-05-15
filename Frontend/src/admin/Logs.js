import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import texfile from "./sample3.txt"
import * as Config from '../common/Config';

const Logs = () => {
  const [Textfile, setTextfile] = useState('')
  // const panelname = Config.panel_name
  const panelname = localStorage.getItem('PanelName')

  // console.log("test", panelname);

  // console.log("aaffsdfsfsdfsdfsdfsda", Textfile && JSON.stringify(Textfile).split("***"));

  const func = () => {
    axios({
      url: `https://api.smartalgo.in:3002/sendfile`,
      method: "post",
      data: {
        'panel_name': panelname,
      },
    
    }).then((res) => {
      if (res.status == 200) {
        var a = res.data.replace(/[@]/g, '')


        setTextfile(res.data.replace(/[@]/g, ''))
      }
    })
  }



  useEffect(() => {
    func()
  }, [])





  return (
    <>

      <div className="content">
        <div className="row" style={{ marginTop: "-25px", height: '80vh' }}>
          <div className="col-md-12">
            <div className="card" style={{ height: '85vh', overflowY: 'scroll', overflowX: 'hidden' }}>
              <div className="card-header">
                <div className="row">
                  <div className="col-md-6 ">
                    <h3 className="card-title mx-3">Logs</h3>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  {Textfile && JSON.stringify(Textfile).split("***")?.map((x) => {
                    // console.log("itemmm" ,x.replace('\n\n-------------------------------------------------------------------------------------------------------------------------------- n\ ' , ""))
                    return <p style={{ fontSize: '17px', fontWeight: '500' }}>{x.replace('n--------------------------------------------------------------------------------------------------------------------------------', "")}</p>
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* <iframe src={Textfile} style={{ width: '100%', height: "80vh", fontSize: "31px" }} title="W3Schools Free Online Web Tutorials" /> */}

      {/* <div><button onClick={(s) => func()}>click </button></div> */}
    </>
  )
}

export default Logs