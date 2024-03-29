import {
    Avatar,
    CircularProgress,
    IconButton,
    LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow,
    Tooltip
} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {Search} from "../../../../components/search";
import {DeleteDialog} from "../../../../components/deleteDialog";
import {IconChevronDown} from "@tabler/icons-react";


const RequestsAccordion = ({data, allList, setAllList, setList, page, rowsPerPage}) => {
    const [open, setOpen] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(false)

    const Delete = () => {
        axios.put(process.env.REACT_APP_NODE_API + '/admin/deleteRequest',
            {
                id: deleteId
            }
        ).then(res => {
            if (!res.data.error) {
                setAllList(res.data)
                setList(res.data.slice(page, page+rowsPerPage))
                setDeleteLoading(false)
            }
        })
    }


    return(
        <div className={'request_table__accordion'}>
            {
                dialogOpen ?
                    <DeleteDialog setOpen={setDialogOpen} onDelete={Delete} text={'You Want Delete Request?'}/>
                    :
                    null
            }
            <div className={'request_table__accordion__header'}>
                <b className={'mini'}>{allList.indexOf(data)+1}</b>
                <p>{data.name}</p>
                <p className={'medium'}>{data.email}</p>
                <p>{data.phone}</p>
                <p>{data.requests.length}</p>
                <p>{data.date}</p>
                <div>
                    <IconChevronDown onClick={() => setOpen(!open)} style={{rotate: open ? '180deg' : '0deg', cursor: "pointer"}}/>

                    <Tooltip title="Delete" onClick={() => {
                        setDialogOpen(true)
                        setDeleteLoading(true)
                        setDeleteId(data._id)
                    }}>
                        <IconButton>
                            {
                                deleteLoading ?
                                    <CircularProgress color={'inherit'} style={{width: 25, height: 25}}/>
                                    :
                                    <DeleteOutlineOutlinedIcon/>
                            }
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            {
                open ?
                    <div className={'request_table__accordion__content'}>
                        <TableContainer component={Paper} sx={{boxShadow: "none"}}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Request</TableCell>
                                        <TableCell align="right">Country Of Origin</TableCell>
                                        <TableCell align="right">Country Of Delivery</TableCell>
                                        <TableCell align="right">Type Of Services</TableCell>
                                        <TableCell align="right">Weight (cm)</TableCell>
                                        <TableCell align="right">Height (cm)</TableCell>
                                        <TableCell align="right">Width (cm)</TableCell>
                                        <TableCell align="right">Length (cm)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.requests?.map((row, i) => (
                                        <TableRow
                                            key={row.CountryOfOrigin+i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                Request {i+1}
                                            </TableCell>
                                            <TableCell align="right">{row.origin}</TableCell>
                                            <TableCell align="right">{row.delivery}</TableCell>
                                            <TableCell align="right">{row.service}</TableCell>
                                            <TableCell align="right">{row.weight}</TableCell>
                                            <TableCell align="right">{row.height}</TableCell>
                                            <TableCell align="right">{row.width}</TableCell>
                                            <TableCell align="right">{row.length}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    :
                    null
            }

        </div>
    )
}

export const Requests = () => {
    const [reviewsAllList, setReviewsAllList] = useState(null)
    const [reviewsList, setReviewsList] = useState(null)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        axios.get(process.env.REACT_APP_NODE_API + '/admin/getAllRequests').then(r => {
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


    return(
        <div className={'review_table'}>
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
                <b>Requests Count</b>
                <b>Sending At</b>
                <b >Action</b>
            </div>

            {
                reviewsAllList
                    ?
                    <div className="review_table__section">
                        {
                            reviewsList.map((el, i) => (
                                <RequestsAccordion
                                    key={i}
                                    data={el}
                                    allList={reviewsAllList}
                                    setAllList={setReviewsAllList}
                                    setList={setReviewsList}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                />
                            ))
                        }
                    </div>
                    :
                    <LinearProgress />

            }
        </div>
    )
}