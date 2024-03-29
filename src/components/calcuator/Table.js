import React from 'react'

export const TableMap = ({ data, delets, name, setEdit, setValue }) => {
    function handleTableEdit(e) {
        setValue(e.value);
        setEdit({ id: e._id, name })
    }
    return (
        <div className='my-3 table-div'>
            <table className='m-0 w-100'>
                <thead>
                    <tr>
                        <td>#</td>
                        <td>English</td>
                        <td>Armenian</td>
                        <td>Russian</td>
                        <td colSpan={2}>Function</td>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((e, i) => {
                        return <tr key={name + i}>
                            <td>{++i}</td>
                            <td>{e.value.en}</td>
                            <td>{e.value.hy}</td>
                            <td>{e.value.ru}</td>
                            <td><button className='button delete px-4 py-2 bg-warning' onClick={() => delets(e._id, name)} > Delete </button></td>
                            <td><button className='button px-4 py-2' onClick={() => handleTableEdit(e)} > Edit </button></td>
                        </tr>
                    }) : <tr><td colSpan={5}>Empty</td></tr>}
                </tbody>
            </table>

        </div>

    )
}
