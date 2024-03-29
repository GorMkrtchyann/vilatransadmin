import {Link} from "react-router-dom";
import {Images} from "../../assets/images/Images";
import {
    IconArrowRight,
    IconCircleFilled, IconCornerRightDown,
    IconLayoutDashboard,
    IconMath1Divide2,
    IconMessage
} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {useCookies} from "react-cookie";
import {DeleteDialog} from "../../components/deleteDialog";


const SidebarList = ({title, list, icon, setListMenu, selected}) => {
    const [open, setOpen] = useState(selected)
    const [listItem, setListItem] = useState(null)
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (!params.item && !params.type){
            setListItem(null)
            setOpen(false)
            setListMenu(null)
        }

        if (params.type === title.toLowerCase()){
            setOpen(true)
        }else{
            setOpen(false)
        }

        if (params.item){
            list.map((el, i) => {
                if (el.toLowerCase() === params.item.toLowerCase()){
                    setListItem(i)
                }
            })
        }else{
            setListItem(null)
        }
    }, [params.type, params])

    const MainClick = (e) => {
        setListMenu(title)
    }

    const DefaultClick = (itemTitle, i) => {
        setListItem(i)
        navigate(`/dashboard/${title.toLowerCase()}/${itemTitle.toLowerCase()}`)
    }

    return(
        <li className={`sidebar-item ${open || selected ? 'selected' : ''}`} onClick={MainClick}>
            <div className="sidebar-link" onClick={() => {
                setOpen(!open)
                navigate(`/dashboard/${title.toLowerCase()}`)
            }} style={{cursor: "pointer", justifyContent: "space-between"}}>
                <div className={'sidebar-item__btn'}>
                    {icon}
                    <span className="hide-menu">{title}</span>
                </div>
                {
                    open ?
                        <IconCornerRightDown/>
                        :
                        <IconArrowRight/>
                }
            </div>

            {
                open ?
                    <ul className={'sidebar-item__list'}>
                        {
                            list?.map((el, i) => (
                                <li
                                    key={el+i}
                                    className={listItem === i ? 'active' : ''}
                                    onClick={() => DefaultClick(el, i)}
                                ><IconCircleFilled size={8}/> {el}</li>
                            ))
                        }
                    </ul>
                    :
                    null
            }

        </li>
    )
}

export const Sidebar = () => {
    const [listMenu, setListMenu] = useState('')
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [cookies, _, removeCookie] = useCookies(['vilaAdminPanelLogin']);
    const navigate = useNavigate()

    return (
        <div className={'sidebar--border'} style={{maxWidth: 280, minWidth: 280}}>
            {
                deleteDialog ?
                    <DeleteDialog text={'Are you sure logout admin panel?'} setOpen={setDeleteDialog} onDelete={() => {
                        removeCookie('vilaAdminPanelLogin')
                        navigate('/')
                    }}/>
                    :
                    null
            }
            <div className="brand-logo d-flex align-items-center justify-content-between">
                <Link to={'/dashboard'} className="text-nowrap logo-img">
                    <img src={Images.logo} width="180" alt=""/>
                </Link>
                <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                    <i className="ti ti-x fs-8"/>
                </div>
            </div>
            <nav className="sidebar-nav scroll-sidebar">
                <ul id="sidebarnav">
                    <li className="nav-small-cap">
                        <i className="ti ti-dots nav-small-cap-icon fs-4"/>
                        <span className="hide-menu">Content</span>
                    </li>

                    <SidebarList
                        selected={listMenu === 'Pages'}
                        title={'Pages'}
                        setListMenu={setListMenu}
                        icon={<IconLayoutDashboard/>}
                        list={['header', 'home', 'about', 'services', 'single service', 'calculator', 'contact', 'footer']}
                    />

                    <li className="nav-small-cap">
                        <i className="ti ti-dots nav-small-cap-icon fs-4"/>
                        <span className="hide-menu">Messages</span>
                    </li>

                    <div style={{display: "flex", flexDirection: "column", gap: 15}}>
                        <SidebarList setListMenu={setListMenu} selected={listMenu === 'Contact'} title={'Contact'} icon={<IconMessage/> } list={['reviews']}/>
                        <SidebarList setListMenu={setListMenu} selected={listMenu === 'Calculation'} title={'Calculation'} icon={<IconMath1Divide2/> } list={['Requests']}/>
                    </div>
                </ul>
            </nav>
            <button className={'btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2'} onClick={() => setDeleteDialog(true)}>Log Out</button>
        </div>
    )
}