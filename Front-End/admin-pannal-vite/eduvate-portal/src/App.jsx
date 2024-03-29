
import { Route, Routes } from 'react-router-dom'
import './App.css'
import RootComponent from '../components/root-template'
import Dashboard from '../components/Dashboard'
import Schools, { ShowSchools } from '../components/Schools'
import Training from '../components/Trainings'
import SchoolRegistration from '../components/SchoolRegistration'
import Login from '../components/Login'

function App() {

  return (
    <main>
      <Routes>
        <Route path='/' element={
          <RootComponent />
        }>
          <Route index element={< Dashboard />} />
          <Route path='/training' element={<Training />} />
          <Route path='/schools' element={<Schools />} />
          <Route path='/schools/:id' element={<ShowSchools/>}/>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/school-register' element={<SchoolRegistration />} />
      </Routes>
    </main>
  )
}

export default App
