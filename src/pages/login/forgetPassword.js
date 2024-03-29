import {Link} from "react-router-dom";
import {Images} from "../../assets/images/Images";
import {useForm} from "react-hook-form";
import {IconLockOpen, IconPassword} from "@tabler/icons-react";
import axios from "axios";
import {useNavigate} from "react-router";
import {useState} from "react";
import {Alert} from "@mui/material";
import {VilaButton} from "../../components/Button";


export const ForgetPassword = () => {
    const {handleSubmit, register} = useForm()
    const [alert, setAlert] = useState(false)
    const [alertErr, setAlertErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const Submit = (data) => {
        setLoading(true)
        axios.post(process.env.REACT_APP_NODE_API + '/admin/forgetPassword', {
            name: data.name,
        }).then(r => {
            if (!r.data.error){
                setAlert(r.data.message)
                setLoading(false)
                setTimeout(() => navigate('/'), 6000)
            }else{
                setLoading(false)
                setAlertErr(r.data.error)
                setTimeout(() => setAlertErr(false), 4000)
            }
        })
    }

    return(
        <div className="page-wrapper" id="main-wrapper">
            <div
                className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <Link to="/"
                                       className="text-nowrap logo-img text-center d-block py-3 w-100">
                                        <img src={Images.logo} width="180" alt="" />
                                    </Link>
                                    <p className="text-center">Welcome to admin panel</p>
                                    <form onSubmit={handleSubmit(Submit)}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="exampleInputEmail1"
                                                {...register('name')}
                                            />
                                        </div>

                                        {
                                            alert ?
                                                <Alert severity="success" style={{marginBottom: 10}}>{alert}</Alert>
                                                :
                                                null
                                        }

                                        {
                                            alertErr ?
                                                <Alert severity="error" style={{marginBottom: 10}}>{alertErr}</Alert>
                                                :
                                                null
                                        }

                                        <VilaButton text={'Send'} loading={loading} loadingText={'Sending...'}/>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}