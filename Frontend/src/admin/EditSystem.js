import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as Config from '../common/Config';
import * as Constant from '../common/ConstantMessage';
import AlertToast from '../common/AlertToast';

export default function EditStrategy() {

  const g_id = useParams();

  const [strategyName,setStrategyName] = useState();
  const [showAlert, setShowAlert] = useState(false);
const [textAlert, setTextAlert] = useState("");
const [alertColor, setAlertColor] = useState("");

const admin_token = localStorage.getItem("token");
const adminId = localStorage.getItem("adminId");
 
const StrategyNameById = () =>{
  axios({
    method:"post",
    url: `${Config.base_url}admin/strategy/strategyname`,
    data: {'adminId': adminId,'strat_id':g_id.id},
    headers: {
      'x-access-token': admin_token
    }
  }).then((res)=>{
setStrategyName(res.data.Strat_Name)
  })
}

  useEffect(()=>{
    StrategyNameById()
  },[])


  const Updatestrategy = () =>{
    axios({
      method:"post",
      url: `${Config.base_url}admin/strategy/update`,
      data: {'adminId': adminId,'strat_id':g_id.id,'StrategyName':strategyName},
      headers: {
        'x-access-token': admin_token
      }
    }).then((res)=>{
      if(res){
      
         setShowAlert(true);
          setTextAlert(Constant.STRATGY_UPDATED_SUCCESS);
          setAlertColor('success')
    
      }
    })
  }

  const onAlertClose = e => {
    setShowAlert(false);
  }

  return <>
   <div className="content">
        <div className="row">
        <div className="col-md-8">
       <div className="card">
              <div className="card-header">
                <h5 className="title">Edit Strategy</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-10 pr-1">
                      <div className="form-group">
                        <label>Enter Strategy Name</label>
                        <input type="text" 
                        value={strategyName} 
                        onChange={(e) => {setStrategyName(e.target.value)}} 
                        className="form-control"  placeholder="Strategy Name"/>
                      </div>
                    </div>
                  </div>
               
      
             <div className="row">
             <div className="col-md-10 pr-1">
             <button type="button" 
             onClick={(e) => {Updatestrategy(e)}} 
             className="btn btn-primary btn-block">Update</button>
             </div>
             </div>
                </form>
              </div>
            </div>
          </div>
          { showAlert && 
<AlertToast
 hideAlert={onAlertClose}
 showAlert={showAlert}
 message={textAlert}
 alertColor={alertColor}
/>
}
            </div>
        </div>
  </>;
}
