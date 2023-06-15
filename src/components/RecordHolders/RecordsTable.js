import { useEffect, useState } from "react"
import './RecordTable.css'

const RecordsTable = ({data: changeData}) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await fetch('http://localhost:5000/get-record-holders')
            .then((data) => data.json())
            .then((res) => setData(res))
            .catch((e) => {
                setError(true)
                console.error(e)
            })
            setLoading(false)
        }
        fetchData()
    }, [changeData])
    const records = data.sort((a, b) => b.score - a.score).slice(0, 5)
    if (error) {
        return <div className="error">Something went wrong...</div>
    }
    if (loading) {
        return <div className="loading">Loading...</div>
    }
    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            {records?.map((record) => <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.score}</td>
            </tr>)}
        </tbody>
    </table>
}

export default RecordsTable