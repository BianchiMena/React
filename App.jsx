import React, { useState } from "react";
import Home from "./Home";
import Friends from "./components/friends/Friends";
import NewFriend from "./components/friends/NewFriend";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/techcompanies/companies";
import Events from "./components/events/Events";
import Ajax from "./TestAndAjax";
import LogIn from "./components/user/LogIn";
import Register from "./components/user/Register";
import SiteNav from "./SiteNav";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Cars from "./components/codeChallenge/Cars";
import Car from "./components/codeChallenge/Car";

function App() {
  const [user] = useState({
    firstName: "Unknown",
    lastName: "User",
    isLoggedIn: false,
  });

  return (
    <React.Fragment>
      <SiteNav user={user} />
      <div className="Container">
        <Routes>
          <Route path="/Home" element={<Home user={user} />}></Route>
          <Route path="/Friends" element={<Friends />}></Route>
          <Route path="/Friends/New" element={<NewFriend />}>
            <Route
              path="/Friends/New/:friendId"
              element={<NewFriend />}
            ></Route>
          </Route>
          <Route path="/Jobs" element={<Jobs />}></Route>
          <Route path="/TechCompanies" element={<Companies />}></Route>
          <Route path="/Events" element={<Events />}></Route>
          <Route path="/TestandAjax" element={<Ajax />}></Route>
          <Route path="/LogIn" element={<LogIn />}></Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/Car" element={<Car />}></Route>
          <Route path="/Cars" element={<Cars />}></Route>
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
