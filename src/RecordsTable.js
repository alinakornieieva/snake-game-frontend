import { useEffect, useState } from "react"
import './RecordTable.css'

const RecordsTable = ({data: changeData}) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            await fetch('http://localhost:5000/get-record-holders')
            .then((data) => data.json())
            .then((res) => setData(res))
            .catch((e) => {
                setError(true)
                console.error(e)
            })
        }
        fetchData()
    }, [changeData])
    const records = data.sort((a, b) => b.score - a.score).slice(0, 5)
    return <table>
            <tr>
                <th>Name</th>
                <th>Score</th>
            </tr>
        {records?.map((record) => <tr key={record.id}>
            <td>{record.name}</td>
            <td>{record.score}</td>
        </tr>)}
    </table>
}

export default RecordsTable