import {
    CircularProgress,
    IconButton,
    LinearProgress,
    TablePagination,
    Tooltip
} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {Search} from "../../../../components/search";
import {DeleteDialog} from "../../../../components/deleteDialog";


export const Reviews = () => {
    const [reviewsAllList, setReviewsAllList] = useState(null)
    const [reviewsList, setReviewsList] = useState(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [refresh, setRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(false)

    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/contact/getAllReviews').then(r => {
            if (!r.data.error){
                setReviewsAllList(r.data)
                setReviewsList(r.data.slice(page, page+rowsPerPage))
            }
        })
    }, [refresh])

    const PageChange = (e, page) => {
        setPage(page)
        if (page === 0){
            setReviewsList(reviewsAllList.slice(page, page+rowsPerPage))
        }else if(page*rowsPerPage === reviewsAllList.length-1){
            setReviewsList(reviewsAllList.slice(page*rowsPerPage))
        }else{
            setReviewsList(reviewsAllList.slice(page+rowsPerPage-1, ((page+1)*rowsPerPage)))
        }
    }

    const Searching = (text) => {
        setPage(0)
        setReviewsList(reviewsAllList.filter(el => (el.name.toLowerCase().includes(text) || el.phone.toLowerCase().includes(text) || el.email.toLowerCase().includes(text))))
    }

    const Delete = () => {
        axios.put(process.env.REACT_APP_NODE_API + '/admin/deleteReview',
            {
                id: deleteId
            }
        ).then(res => {
            if (!res.data.error) {
                setReviewsAllList(res.data)
                setReviewsList(res.data.slice(page, page+rowsPerPage))
                setDeleteLoading(false)
            }
        })
    }

    return(
            <div className={'review_table'}>
                {
                    open ?
                        <DeleteDialog setOpen={setOpen} onDelete={Delete} text={'You Want Delete Review?'}/>
                        :
                        null
                }
                <div className={'review_table__top'}>
                    <TablePagination
                        component="div"
                        count={reviewsAllList?.length}
                        page={page}
                        onPageChange={PageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />

                    <Search onSearch={Searching} onRefresh={() => {
                        setRefresh(!refresh)
                        setReviewsAllList(null)
                    }}
                            refreshLoading={!reviewsAllList}
                    />
                </div>

                <div className="review_table__header">
                    <b className={'mini'}>#</b>
                    <b>Name</b>
                    <b className={'medium'}>Email</b>
                    <b>Phone</b>
                    <b>Topic</b>
                    <b className={'large'}>Message</b>
                    <b>Sending At</b>
                    <b className={'mini'}>Action</b>
                </div>

                {
                    reviewsAllList
                        ?
                        <div className="review_table__section">
                            {
                                reviewsList.map((el, i) => (
                                    <div className="review_table__section__item">
                                        <b className={'mini'}>{reviewsAllList.indexOf(el)+1}</b>
                                        <p>{el.name}</p>
                                        <p className={'medium'}>{el.email}</p>
                                        <p>{el.phone}</p>
                                        <p>{el.subject}</p>
                                        <p className={'large'}>{el.text}</p>
                                        <p>{el.date}</p>
                                        <div className={'mini'}>
                                            <Tooltip title="Delete" onClick={() => {
                                                setOpen(true)
                                                setDeleteLoading(true)
                                                setDeleteId(el._id)
                                            }}>
                                                <IconButton>
                                                    {
                                                        deleteLoading ?
                                                            deleteId === el._id ?
                                                                <CircularProgress color={'inherit'} style={{width: 25, height: 25}}/>
                                                                :
                                                                <DeleteOutlineOutlinedIcon/>
                                                            :
                                                            <DeleteOutlineOutlinedIcon/>
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <LinearProgress />

                }
            </div>
    )
}