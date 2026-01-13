import '../App.css'
import { Link } from "react-router-dom"; 
import React, { useState } from "react";
import { useEffect } from 'react';
function Home({user}) {
  const [logooption, setLogooption] = useState("");
  const [errmess, setErrmess] = useState(false);
  useEffect(()=>{
    const ele = document.getElementsByClassName("rpage");
    if (ele.length > 0){
    ele[0].scrollIntoView({ behavior: 'smooth'});
    //console.log(ele);
    }
  },[logooption]);

  const createBoard = async(e,user) =>{
    e.preventDefault();
    const formData = {
      info: {
        member1: user
      },
      name: e.target.elements.name.value,
      joincode: e.target.elements.joincode.value
    };
    if(!user){
      setErrmess(true);
      return;
      
    }
    try {
    const response = await fetch('http://localhost:3000/api/data/lb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if(!response.ok){
      setErrmess(true);
      return;
    }
    else{
      setErrmess(false);
    }
    } catch (error) {
    setErrmess(true);
    }
  }

  const joinBoard = async(e,user) => {
    
  }

  return (
    <div className="App">
      <div className="header">
            <h1>Keep Your Grades Up</h1>
            <p>{(user) ? user.username:"logged out"}</p>
            <button><Link to="/login">Log In</Link></button>
      </div>
      <div className='subhead'>Create grade leaderboards with your friends and encourage friendly competition between peers!</div>
      <div className='mainbox'>
        <div className='logo' onClick={() => setLogooption("Create New Leaderboard")}>Create New Leaderboard</div>
        <div className='logo'onClick={() => setLogooption("Join Existing Leaderboard")}>Join Existing Leaderboard</div>
        <div className='logo' onClick={() => setLogooption("See Current Standings")}>See Current Standings</div>
      </div>
      <div> {/* this for the page after selecting option*/}
      {(logooption == "Create New Leaderboard") && (<div className='rpage' id='cnl'> 
        <form className='boardform' onSubmit={(e) => createBoard(e, user)}>
          {errmess && (<div className='invalid'>Invalid info!</div>)}
          <input name='name' placeholder='Leaderboard name' />
          <input name='joincode' placeholder='join code'/>
          <button className='boardbutton'>Create?</button>
        </form>
      </div>)}
      {(logooption == "Join Existing Leaderboard") && (<div className='rpage' id='jel'>
        <form className='boardform' onSubmit={(e) => createBoard(e, user)}>
          {errmess && (<div className='invalid'>Invalid LeaderBoard</div>)}
          <input name='joincode' placeholder='join code'/>
          <button className='boardbutton'>Join</button>
        </form>
      </div>)}
      {(logooption == "See Current Standings") && (<div className='rpage'>
        g
      </div>)}
      </div>
    </div>
  );
}
export default Home;