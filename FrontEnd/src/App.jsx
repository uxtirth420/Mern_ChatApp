import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './Pages/Homepage'

const Chatpage = React.lazy(() => import('./Pages/Chatpage'))

function App() {
  return (
    <>
      <div className="App">
        <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center' }}>Loading chat...</div>}>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/chats' element={<Chatpage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
