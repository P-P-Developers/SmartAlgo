import React, { useEffect, Suspense, lazy } from "react";
import axios from "axios"
import './App.css';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import LazyLoad from "./LazyLoad.js"
import * as Config from './common/Config';
import Error from "./Error.jsx";


// -------------------------------------------------- lazy LOading------------------------------------------------------

// COMMON Client
import Dashboard from "./client/Dashboard";
import ClientTemplate from "./client/Template";
// COMMON Admin
import AdminDashboard from "./admin/Dashboard";
import AdminTemplate from "./admin/Template";

// COMMON Super Admin
import SuperAdminDashboard from "./superadmin/Dashboard";
import SuperAdminTemplate from "./superadmin/Template";

// Manual Trade
import ManualDashboard from "./manualtrade/ManualDashboard";
import ManualTemplate from "./manualtrade/Template";


// FOR CLIENT SIDE

const Clientlogin = lazy(() => import('./client/Login'));
const Clienttradehistory = lazy(() => import('./client/Tradehistory'));
const ApiCreateInformationClient = lazy(() => import('./client/ApiCreateInformationClient'));
const BrokerResponse = lazy(() => import('./client/BrokerResponse'));
const TradingStatus = lazy(() => import('./client/TradingStatus'));
const Help = lazy(() => import('./client/Help'));
const Clientsignals = lazy(() => import('./client/Signals'));
const ClientProfile = lazy(() => import('./client/ClientProfile'));
const ClientForgotPassword = lazy(() => import('./client/ForgotPassword'));
const ClientResetPassword = lazy(() => import('./client/ResetPassword'));
const TradeHistoryD = lazy(() => import('./client/Tradehistoryd'));
const ClientSignup = lazy(() => import('./client/ClientSignup'));
const StrategyDescription = lazy(() => import('./client/StrategyDescription'));
const Auth2 = lazy(() => import('./client/Auth2'));



//  FOR ADMIN SIDE

const Adminlogin = lazy(() => import('./admin/Login'));
const AdminProfile = lazy(() => import('./admin/AdminProfile'));
const AdminForgotPassword = lazy(() => import('./admin/ForgotPassword'));
const AdminResetPassword = lazy(() => import('./admin/ResetPassword'));
const Signals = lazy(() => import('./admin/Signals'));
const SubAdmin = lazy(() => import('./admin/SubAdmin'));
const AddNewSubadmin = lazy(() => import('./admin/AddNewSubadmin'));
const EditSubadmin = lazy(() => import('./admin/EditSubadmin'));
const System = lazy(() => import('./admin/System'));
const Strategy = lazy(() => import('./admin/Strategy'));
const AddStrategy = lazy(() => import('./admin/AddStrategy'));
const EditStrategy = lazy(() => import('./admin/EditStrategy'));
const AddStrategyToClients = lazy(() => import('./admin/AddStrategyToClients'));
const Services = lazy(() => import('./admin/Services'));
const AddService = lazy(() => import('./admin/AddService'));
const Groupservice = lazy(() => import('./admin/Groupservice'));
const Addgroupservice = lazy(() => import('./admin/Addgroupservice'));
const Editgroupservice = lazy(() => import('./admin/Editgroupservice'));
const AdminReports = lazy(() => import('./admin/Reports'));
const Clients = lazy(() => import('./admin/Clients'));
const Editclient = lazy(() => import('./admin/Editclient'));
const AddClient = lazy(() => import('./admin/AddClient'));
const Tradehistory = lazy(() => import('./admin/Tradehistory'));
const Tradehistory_le = lazy(() => import('./admin/Tradehistory_le'));

const MessageBroadcast = lazy(() => import('./admin/MessageBroadcast'));
const TransactionLicence = lazy(() => import('./admin/TransactionLicence'));
const ApiCreateInformation = lazy(() => import('./admin/ApiCreateInformation'));
const TradingStatusAdmin = lazy(() => import('./admin/TradingStatusAdmin'));
const AdminHelpCenter = lazy(() => import('./admin/AdminHelpCenter'));
const TradehistoryDemo = lazy(() => import('./admin/TradehistorDemo'));
const SubadminClients = lazy(() => import('./admin/SubadminClients'));
const DemoClients = lazy(() => import('./admin/DemoClients'));
const Logs = lazy(() => import('./admin/Logs'));
const TradeExecutionDetails = lazy(() => import('./admin/TradeExecutionDetails'));
const TradeHistoryNew = lazy(() => import('./admin/TradeHistoryNew'));
const LoginNew = lazy(() => import('./admin/LoginNew'));
const ClientTradeHistoryAd = lazy(() => import('./admin/ClientTradeHistoryAd'));
const ReleaseUpdates = lazy(() => import('./admin/ReleaseUpdates'));
const ExpiredLicence = lazy(() => import('./admin/ExpiredLicence'));
const SignupClients = lazy(() => import('./admin/SignupClients'));
const AddLicence = lazy(() => import('./admin/AddLicence'));
const TestPagination = lazy(() => import('./admin/TestPagination'));
const StrategyDevelopment = lazy(() => import('./admin/StrategyDevelopment'));
const Faqs = lazy(() => import('./admin/Faqs'));



//  Sub Admin
const ClientList = lazy(() => import('./subadmin/ClientList'));
const SubTradingStatus = lazy(() => import('./subadmin/SubTradingStatus'));


// Super Admin
const SuperAdminlogin = lazy(() => import('./superadmin/Login'));
const AdminList = lazy(() => import('./superadmin/AdminList'));
const AddAdmin = lazy(() => import('./superadmin/AddAdmin'));
const AdminClientView = lazy(() => import('./superadmin/AdminClientView'));
const SubAdminViewSa = lazy(() => import('./superadmin/SubAdminViewSa'))
const EditFromSuperClient = lazy(() => import('./superadmin/EditFromSuperClient'))
const SuperAdminHistory = lazy(() => import('./superadmin/SuperAdminHistory'))
const SuperSignalsEdit = lazy(() => import('./superadmin/SuperSignalsEdit'))
const SuperAdminMessageBroadcast = lazy(() => import('./superadmin/SuperAdminMessageBroadcast'))
const TransactionLicenceSa = lazy(() => import('./superadmin/TransactionLicenceSa'))
const ColumnAddQuery = lazy(() => import('./superadmin/ColumnAddQuery'))
const LicencePayments = lazy(() => import('./superadmin/LicencePayments'))
const SuperAdminHelpCentre = lazy(() => import('./superadmin/SuperAdminHelpCentre'))

// Manual Trading
// const LoginManual = lazy(() => import('./manualtrade/LoginManual'));
// const ManualTradeExecution = lazy(() => import('./manualtrade/ManualTradeExecution'));

const ManualLogin = lazy(() => import('./manualtrade/Login'));
// const ManualExecuteTrade = lazy(() => import('./manualtrade/ExecuteTrade/ManualExecuteTrade'));
const ManualExecuteTrade = lazy(() => import('./manualtrade/Components/ExecuteTrade/ManualExecuteTrad'));
const ClosePositions = lazy(() => import('./manualtrade/Components/ExecuteTrade/ClosePositions'));
const NewMessenger = lazy(() => import('./manualtrade/Components/NewMessenger/MainComponent'));
const OpenPosition = lazy(() => import('./manualtrade/Components/OpenPosition/OpenPosition'));
const Test = lazy(() => import('./manualtrade/Components/test'));
const OptionChain = lazy(() => import('./manualtrade/Components/OptionChain/OptionChain'));
const apiUrl = process.env.REACT_APP_API_URL;
const environment = process.env.REACT_APP_ENV;






function getFaviconEl() {
  return document.getElementById("favicon");
}

function App() {



  const handleGoogle = () => {
    const favicon = getFaviconEl(); // Accessing favicon element
    axios({
      method: "get",
      url: `${Config.base_url}admin/system_company`,
      data: {},

    }).then(function (response) {
      favicon.href = `/images/${response.data.data[0].favicon}`;
    });
  };


  useEffect(() => {
    handleGoogle()
  }, [])

  console.log("Environment:", window.location);

if (window.location.hash.includes("/client/services")) {
  console.log("Redirecting from:", window.location.pathname);
  window.location.replace("/"); // `replace` avoids adding to history
}



  return (<>

    <HashRouter>
      <Routes>

        {/*admin route*/}

        <Route path="admin/dashboard" element={<AdminTemplate page={<AdminDashboard />} />} />
        <Route path="admin/services/*" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Services />} /></Suspense>} />
        <Route path="admin/services/add-service" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AddService />} /></Suspense>} />
        <Route path="admin/group-services/*" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Groupservice />} /></Suspense>} />
        <Route path="admin/group-service/:id" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Editgroupservice />} /></Suspense>} />
        <Route path="admin/add-group/*" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Addgroupservice />} /></Suspense>} />
        <Route path={`admin/clients/*`} element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Clients />} /></Suspense>} />
        <Route path="admin/client/:status" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Editclient />} /></Suspense>} />
        <Route path="admin/client/add-client" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AddClient />} /></Suspense>} />
        <Route path="admin/tradehistory" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Tradehistory />} /></Suspense>} />
        <Route path="admin/tradehistory_entry" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Tradehistory_le />} /></Suspense>} />


        <Route path="admin/signals/" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Signals />} /></Suspense>} />
        <Route path="admin/SubAdmin" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<SubAdmin />} /></Suspense>} />
        <Route path="admin/editsubadmin" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<EditSubadmin />} /></Suspense>} />
        <Route path="admin/AddNewSubadmin" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AddNewSubadmin />} /></Suspense>} />
        <Route path="admin/message-broadcast" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<MessageBroadcast />} /></Suspense>} />
        <Route path="admin/reports" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AdminReports />} /></Suspense>} />
        <Route path="admin/strategy" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Strategy />} /></Suspense>} />
        <Route path="admin/edit-strategy/:id" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<EditStrategy />} /></Suspense>} />
        <Route path="admin/add-strategy" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AddStrategy />} /></Suspense>} />
        <Route path="admin/add-strategy-toclients/:id" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AddStrategyToClients />} /></Suspense>} />
        <Route path="admin/system" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<System />} /></Suspense>} />
        <Route path="admin/forgot-password" element={<Suspense fallback={<LazyLoad />}><AdminForgotPassword /></Suspense>} />
        <Route path="admin/reset-password" element={<Suspense fallback={<LazyLoad />}><AdminResetPassword /></Suspense>} />
        <Route path="admin/login/*" element={<Suspense fallback={<LazyLoad />}><Adminlogin /></Suspense>} />
        <Route path="admin/AdminProfile" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AdminProfile />} /></Suspense>} />
        <Route path="admin/ApiClientInformation" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<ApiCreateInformation />} /></Suspense>} />
        <Route path="admin/transactionlicence" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<TransactionLicence />} /></Suspense>} />
        <Route path="admin/tradingstatusadmin" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<TradingStatusAdmin />} /></Suspense>} />
        <Route path="admin/helpadmin" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AdminHelpCenter />} /></Suspense>} />
        <Route path="admin/tradehistorydemo" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<TradehistoryDemo />} /></Suspense>} />
        <Route path="admin/subadminclients" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<SubadminClients />} /></Suspense>} />
        <Route path="admin/democlients" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<DemoClients />} /></Suspense>} />
        <Route path="admin/logs" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Logs />} /></Suspense>} />
        <Route path="admin/tradeexecutiondetails" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<TradeExecutionDetails />} /></Suspense>} />
        <Route path="admin/tradehistoryn" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<TradeHistoryNew />} /></Suspense>} />
        <Route path="admin/loginnew" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<LoginNew />} /></Suspense>} />
        <Route path="admin/clienttradehistoryad" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<ClientTradeHistoryAd />} /></Suspense>} />
        <Route path="admin/releaseupdates" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<ReleaseUpdates />} /></Suspense>} />
        <Route path="admin/expiredlicence" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<ExpiredLicence />} /></Suspense>} />
        <Route path="admin/signupclients" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<SignupClients />} /></Suspense>} />
        <Route path="admin/addlicence" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<AddLicence />} /></Suspense>} />
        <Route path="admin/testpagination" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<TestPagination />} /></Suspense>} />
        <Route path="admin/strategydevelopment" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<StrategyDevelopment />} /></Suspense>} />
        <Route path="admin/faqs" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Faqs />} /></Suspense>} />


        {/* <Route path="*" element={<Error />} /> */}
        {/*    //admin route//*/}
        {/* for Subadmin  */}

        <Route path="subadmin/clientlist" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<ClientList />} /></Suspense>} />
        <Route path="subadmin/subtradingstatus" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<SubTradingStatus />} /></Suspense>} />



        {/* //--client route--//  */}

        <Route path="/" element={<ClientTemplate page={<Dashboard />} />} />
        <Route path="/tradehistory" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<Clienttradehistory />} /></Suspense>} />
        <Route path="/login/*" element={<Suspense fallback={<LazyLoad />}><Clientlogin /></Suspense>} />
        <Route path="/signals" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<Clientsignals />} /></Suspense>} />
        <Route path="/client-profile" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<ClientProfile />} /></Suspense>} />
        <Route path="/client/forgot-password" element={<Suspense fallback={<LazyLoad />}><ClientForgotPassword /></Suspense>} />
        <Route path="/client/resetpassword" element={<Suspense fallback={<LazyLoad />}><ClientResetPassword /></Suspense>} />
        <Route path="/client/apicreateinformation" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<ApiCreateInformationClient />} /></Suspense>} />
        <Route path="/client/brokerresponse" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<BrokerResponse />} /></Suspense>} />
        <Route path="/client/tradingstatus" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<TradingStatus />} /></Suspense>} />
        <Route path="/client/help" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<Help />} /></Suspense>} />
        <Route path="/client/tradehistoryd" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<TradeHistoryD />} /></Suspense>} />
        <Route path="/client/strategydescription" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<StrategyDescription />} /></Suspense>} />
        <Route path="/client/optionchain" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<OptionChain />} /></Suspense>} />
        <Route path="/client/newmessenger" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<NewMessenger />} /></Suspense>} />
        <Route path="/client/manualopenpositions" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<OpenPosition />} /></Suspense>} />
        <Route path="/client/manualclosepositions" element={<Suspense fallback={<LazyLoad />}><ClientTemplate page={<ClosePositions />} /></Suspense>} />

        <Route path="/auth" element={<Suspense fallback={<LazyLoad />}><Auth2 /></Suspense>} />
        <Route path="/csignup" element={<Suspense fallback={<LazyLoad />}><ClientSignup /></Suspense>} />
        {/* <Route path="*" element={<Error />} /> */}
        {/* //--client route--// */}

        {/* // -- super admin routes -- // */}

        <Route path="superadmin/login" element={<Suspense fallback={<LazyLoad />}><SuperAdminlogin /></Suspense>} />
        <Route path="superadmin/dashboard" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<SuperAdminDashboard />} /></Suspense>} />
        <Route path="superadmin/adminlist" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<AdminList />} /> </Suspense>} />
        <Route path="superadmin/adminlist" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<AdminList />} /> </Suspense>} />
        <Route path="superadmin/addadmin" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<AddAdmin />} /> </Suspense>} />
        <Route path="superadmin/adminclientview" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<AdminClientView />} /> </Suspense>} />
        <Route path="superadmin/subadminviewsa" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<SubAdminViewSa />} /> </Suspense>} />
        <Route path="superadmin/editfromsuperclient/:id" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<EditFromSuperClient />} /> </Suspense>} />
        <Route path="superadmin/superadminhistory" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<SuperAdminHistory />} /> </Suspense>} />
        <Route path="superadmin/supersignalsedit/:id" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<SuperSignalsEdit />} /> </Suspense>} />
        <Route path="superadmin/supermessagebroadcast" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<SuperAdminMessageBroadcast />} /> </Suspense>} />
        <Route path="superadmin/transactionlicencesa" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<TransactionLicenceSa />} /> </Suspense>} />
        <Route path="superadmin/columnaddquery" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<ColumnAddQuery />} /> </Suspense>} />
        <Route path="superadmin/licencepayments" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<LicencePayments />} /> </Suspense>} />
        <Route path="superadmin/helpcentre" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<SuperAdminHelpCentre />} /> </Suspense>} />
        <Route path="superadmin/logs" element={<Suspense fallback={<LazyLoad />}><SuperAdminTemplate page={<Logs />} /> </Suspense>} />
        {/* <Route path="admin/logs" element={<Suspense fallback={<LazyLoad />}><AdminTemplate page={<Logs />} /></Suspense>} /> */}

        {/* Manual Trade Route */}

        <Route path="manualtrade/login" element={<Suspense fallback={<LazyLoad />}><ManualLogin /></Suspense>} />
        <Route path="manual/manualdashboard" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<ManualDashboard />} /></Suspense>} />
        {/* <Route path="manual/optionchain" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<ManualExecuteTrade />} /></Suspense>} /> */}
        <Route path="manual/newmessenger" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<NewMessenger />} /></Suspense>} />
        <Route path="manual/manualclosepositions" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<ClosePositions />} /></Suspense>} />
        <Route path="manual/manualopenpositions" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<OpenPosition />} /></Suspense>} />
        <Route path="manual/testabc" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<Test />} /></Suspense>} />
        <Route path="manual/optionchain" element={<Suspense fallback={<LazyLoad />}><ManualTemplate page={<OptionChain />} /></Suspense>} />


      </Routes>
    </HashRouter>
  </>
  );
}

export default App;
