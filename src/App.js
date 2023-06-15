import { useState } from 'react'
import './App.css'
import Board from './Board'
import RecordsTable from './RecordsTable'

const App = () => {
  const [data, setData] = useState(null)
  const changeData = (value) => {
    setData(value)
  }
  return <div className='app'>
    <Board changeData={changeData}/>
    <RecordsTable data={data}/>
  </div>
}

export default App
