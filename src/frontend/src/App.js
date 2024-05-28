import './App.css';
import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import PostEmployee from "./pages/employee/PostEmployee";
import EditEmployee from "./pages/employee/EditEmployee";

const App = () =>{
  return (
         <>
         <Routes>
             <Route path='/' element={<Dashboard />} />
             <Route path='/employees/new' element={<PostEmployee />} />
             <Route path='/employees/:id' element={<EditEmployee />} />
         </Routes>
         </>
  );
};

export default App;
