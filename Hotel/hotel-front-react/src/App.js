import logo from './logo.svg';
import {Route, Routes} from "react-router-dom";
import ShowOne from "./hotel/ShowOne";
import ShowList from "./hotel/ShowList";
import Write from "./hotel/Write";
import Update from "./hotel/Update";
import Auth from "./user/Auth";
import './App.css';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/hotel/showOne/:id" element={<ShowOne/>}/>
                <Route path="/hotel/showList/:pageNo" element={<ShowList/>}/>
                <Route path="/hotel/write" element={<Write/>}/>
                <Route path="/hotel/update/:id" element={<Update/>}/>
                <Route path="/" element={<Auth/>}/>
            </Routes>
        </div>
    );
}

export default App;
