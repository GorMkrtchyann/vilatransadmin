import {Sidebar} from "./sidebar";
import {useNavigate, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {HomeEdit} from "./pages/homeEdit/HomeEdit";
import {Reviews} from "./pages/reviews/Reviews";
import {Requests} from "./pages/requests/Requests";
import {ContactEdit} from "./pages/contactEdit/ContactEdit";
import {HeaderEdit} from "./pages/headerEdit/HeaderEdit";
import {FooterEdit} from "./pages/footerEdit/FooterEdit";
import {Calculator } from "./pages/calculator/Calculator";
import {AboutEdit} from "./pages/aboutEdit/AboutEdit";
import {AddSingleService} from "./pages/singleService/AddSingleService";
import { ServicePage } from "./pages/servicePage/Service";
import {SingleService} from "./pages/singleService/SingleService";
import { PieChart } from '@mui/x-charts/PieChart';
import axios from "axios";
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import {
    IconCategory,
    IconLayoutDashboard,
    IconMath1Divide2,
    IconMessage,
    IconPencil,
    IconTrash
} from "@tabler/icons-react";
import {Link} from "react-router-dom";

const DashboardContentWelcome = () => {
    const [reviews, setReviews] = useState([])
    const [requests, setRequests] = useState([])
    const navigate = useNavigate()
    const menuList = ['header', 'home', 'about', 'services', 'single service', 'calculator', 'contact', 'footer']
    const menuList2 = ['reviews']
    const menuList3 = ['Requests']

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/contact/getAllReviews').then(r => {
            if (!r.data.error){
                setReviews(r.data)
            }
        })
        axios.get(process.env.REACT_APP_NODE_API + '/admin/getAllRequests').then(r => {
            if (!r.data.error){
                setRequests(r.data)
            }
        })
    }, [])

    return(
        <div className={'dashboard__welcome'}>
            <h1>Welcome Vila Trans Admin Panel</h1>

            <div className={'dashboard__welcome__categories'}>
                <div className="dashboard__welcome__categories__item"
                    onClick={() => navigate(`/dashboard/pages`)}
                >
                    <div className={'categories__item__content'}>
                        <h3><IconLayoutDashboard/> Pages</h3>
                        <p>You Can Change Vila Trans Pages Content</p>
                    </div>
                </div>

                <div className="dashboard__welcome__categories__item"
                     onClick={() => navigate(`/dashboard/contact`)}
                >
                    <div className={'categories__item__content'}>
                        <h3><IconMessage/> Contact</h3>
                        <p>You Can See Users Contact Reviews There</p>
                    </div>
                </div>

                <div className="dashboard__welcome__categories__item"
                     onClick={() => navigate(`/dashboard/calculation`)}
                >
                    <div className={'categories__item__content'}>
                        <h3><IconMath1Divide2/> Calculation</h3>
                        <p>You Can See Users Delivery Requests There</p>
                    </div>
                </div>
            </div>

            <div className={'dashboard__welcome__charts'}>
                <div className={'dashboard__welcome__chart'}>
                    <h5>Contact Reviews And Delivery Requests</h5>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: reviews?.length, label: 'Contact Review', color: 'rgb(73,94,252)' },
                                    { id: 1, value: requests?.length, label: 'Request', color: 'rgb(23,219,129)' },
                                ],
                                innerRadius: 30,
                                outerRadius: 100,
                                paddingAngle: 4,
                                cornerRadius: 5,
                                startAngle: -180,
                                endAngle: 180,
                                cx: 110,
                            },
                        ]}
                        width={400}
                        height={200}
                    />
                </div>

                <div className={'dashboard__welcome__chart'}>
                    <h5>Admin Panels Links</h5>
                    <div>
                        <ul>
                            <li>Pages</li>
                            {
                                menuList?.map(el => (
                                    <li key={el}><Link to={`/dashboard/pages/${el.toLowerCase()}`} >{el}</Link></li>
                                ))
                            }
                        </ul>
                        <ul>
                            <li>Contact</li>
                            {
                                menuList2?.map(el => (
                                    <li key={el}><Link to={`/dashboard/contact/${el.toLowerCase()}`} >{el}</Link></li>
                                ))
                            }
                        </ul>
                        <ul>
                            <li>Calculator</li>
                            {
                                menuList3?.map(el => (
                                    <li key={el}><Link to={`/dashboard/calculation/${el.toLowerCase()}`} >{el}</Link></li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

const DashboardContentPagesHome = ({list}) => {
    const navigate = useNavigate()
    const params = useParams()

    return(
        <div className={'dashboard__welcome pageHome'}>
            <div className={'dashboard__welcome__categories'}>
                {
                    list?.map(el => (
                        <div className="dashboard__welcome__categories__item red"
                             key={el}
                             onClick={() => navigate(`/dashboard/${params.type}/${el}`)}
                        >
                            <div className={'categories__item__content'}>
                                <h3><IconCategory/> {el}</h3>
                                {
                                    params.type === 'pages' ?
                                        <p>You Can Change Vila Trans {el} Page</p>
                                        :
                                        <p>You Can See Users Addressed</p>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const DashboardContent = () => {
    const params = useParams()
    const [element, setElement] = useState(null)

    useEffect(() => {
        switch (params.item) {
            case 'header':
                return setElement(<HeaderEdit/>)
            case 'footer':
                return setElement(<FooterEdit/>)
            case 'about':
                return setElement(<AboutEdit/>)
            case 'home':
                return setElement(<HomeEdit/>)
            case 'contact':
                return setElement(<ContactEdit/>)
            case 'reviews':
                return setElement(<Reviews/>)
            case 'requests':
                return setElement(<Requests/>)
            case 'calculator':
                return setElement(<Calculator/>)
            case 'single service':
                return setElement(<SingleService/>)
            case 'services':
                return setElement(<ServicePage />)
        }
    }, [params.item])

    return (element)
}

export const Dashboard = () => {
    const params = useParams()
    const lists = {
        pages: ['header', 'home', 'about', 'services', 'single service', 'calculator', 'contact', 'footer'],
        contact: ['reviews'],
        calculation: ['requests']
    }


    return (
        <div className="page-wrapper dashboard">
            <Sidebar />

            <div className="right_page">
                <div className="right_page__breadcrumbs">
                    {
                        params.item ?
                            <>
                                <p>{params.type}</p>
                                <span>/</span>
                                <p className={'active'}>{params.item}</p>
                            </>
                            :
                            <>
                                <p className={'active'}>{params.type}</p>
                            </>
                    }
                </div>

                {
                    params.type ?
                        params.item ?
                            <DashboardContent />
                            :
                            <DashboardContentPagesHome list={lists[params.type]}/>
                        :
                        <DashboardContentWelcome/>

                }

            </div>
        </div>
    )
}