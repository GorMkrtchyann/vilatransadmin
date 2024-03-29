import {Login} from "./pages/login/Login";
import {Dashboard} from "./pages/dashboard/Dashboard";
import {Navigate, Route, Routes} from "react-router";
import {ForgetPassword} from "./pages/login/forgetPassword";
import {useCookies} from "react-cookie";

function App() {
    const [cookies, _, removeCookie] = useCookies(['vilaAdminPanelLogin']);

    // window.addEventListener('beforeunload', (e) => {
    //     removeCookie('vilaAdminPanelLogin')
    // })

    return (
      <div>
        <Routes>
          <Route path={'/'} element={<Login/>}/>
          <Route path={'/forgetPassword'} element={<ForgetPassword/>}/>
            {
                cookies?.vilaAdminPanelLogin ?
                    atob(cookies?.vilaAdminPanelLogin) === 'trueLogin' ?
                    <>
                        <Route path={'/dashboard'} element={<Dashboard/>}/>
                        <Route path={'/dashboard/:type'} element={<Dashboard/>}/>
                        <Route path={'/dashboard/:type/:item'} element={<Dashboard/>}/>
                    </>
                    : null
                     : null
            }
            <Route path={'*'} element={<Navigate to={'/'}/>} />
        </Routes>
      </div>
  );
}

export default App;
