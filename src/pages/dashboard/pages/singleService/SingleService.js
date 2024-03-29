import {Button, CircularProgress, IconButton, LinearProgress, Tooltip} from "@mui/material";
import {IconBrowserPlus, IconEye, IconPencil, IconTrash} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {AddSingleService} from "./AddSingleService";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";


export const SingleService = () => {
    const [changePage, setChangePage] = useState(true)
    const [allPage, setAllPage] = useState(null)
    const [editPage, setEditPage] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deletedId, setDeletedId] = useState(null)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/singleService/getAllPage').then(
            r => {
                if (!r.data.error) {
                    setAllPage(r.data)
                }
            }
        )
    }, [changePage])

    const AddSubmit = (banner, title, contentObj) => {
        return axios.post(process.env.REACT_APP_NODE_API + '/singleService/addSingleService', {
            banner: banner,
            title: title,
            content: contentObj
        })
    }

    const UpdateSubmit = (banner, title, contentObj) => {
        return axios.put(process.env.REACT_APP_NODE_API + '/singleService/updatePage', {
            _id: editPage._id,
            banner: banner,
            title: title,
            content: contentObj
        })
    }

    const DeleteSubmit = (id) => {
        setDeletedId(id)
        setDeleteLoading(true)
        axios.put(process.env.REACT_APP_NODE_API + '/singleService/deletePage', {
            _id: id
        }).then(
            r => {
                if (!r.data.error) {
                    setDeleteLoading(false)
                    setAllPage(r.data)
                }
            }
        )
    }

    return (
        changePage ?
            <div className={'singleServiceHome'}>
                <div className="singleServiceHome__top">
                    <h4>Your Pages</h4>

                    <Button variant={'text'} onClick={() => setChangePage(false)}><IconBrowserPlus stroke={1.4}/> Add
                        Page</Button>
                </div>
                {
                    allPage ?
                        <div className="singleServiceHome__pages">
                            {

                                allPage?.map((el, i) => (
                                    <div key={el + i} className="singleServiceHome__pages__item">
                                        <img src={el.banner} alt=""/>
                                        <div className="gradient"/>
                                        <div className="texts">
                                            <div className={'actions'}>
                                                <Tooltip title="Edit" onClick={() => {
                                                    setEditPage(el)
                                                    setChangePage(false)
                                                }}>
                                                    <IconButton>
                                                        <IconPencil/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" onClick={() => DeleteSubmit(el._id)}>
                                                    {
                                                        deleteLoading ?
                                                            deletedId === el._id ?
                                                                <CircularProgress color={'inherit'}
                                                                                  style={{width: 25, height: 25}}/>
                                                                :
                                                                <IconTrash/>
                                                            :
                                                            <IconTrash/>
                                                    }
                                                </Tooltip>
                                            </div>
                                            <h4>{el.title.en}</h4>
                                        </div>
                                    </div>
                                ))

                            }
                        </div>
                        :
                        <LinearProgress />
                }

            </div>
            :
            <AddSingleService setChangePage={setChangePage} AddSubmit={editPage ? UpdateSubmit : AddSubmit}
                              editPage={editPage}/>
    )
}