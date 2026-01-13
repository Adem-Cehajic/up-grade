import '../App.css'
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login({setUser,setPass,setMail}) {
    const navigate = useNavigate();
    const [errmess, setErrmess] = useState(false);
    const [newacc, setNewAcc] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    function checkall(username,password,email){ //just makes sure that they are words
      if (!username.trim() || !password.trim() || (!email.trim() && !newacc)){
        return false;
      }
      else{
        return true;
      }
    }
    // get request to check info
    const checkdata = async (user, pass) => {
      try{
        const response = await fetch('http://localhost:3000/api/data');
        const result = await response.json();
        result.forEach(element => {
          if(element.username == user && element.password == pass){
            navigate('/');
            return;
          }
        });
        setErrmess(true);
      }
      catch (error) {
          console.error('Error:', error);
          setErrmess(true);
        }
    }
    // POST request function this is used to create new accounts
    const sendToDatabase = async (user) => {
        try {
            const response = await fetch('http://localhost:3000/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('User saved:', result.data);
                navigate('/'); // Redirect after successful login
            } else {
                setErrmess(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrmess(true);
        }
    };
    const handleLogin = (e) => { //this function handles all the problems that happen on a bad login like an invalid user name or smth
    e.preventDefault();
    if(checkall(username,password,email)){
      setUser({ username });
      setPass({ password});
      setMail({ email });
      if(!newacc){
        sendToDatabase({username, password, email: newacc ? null : email,});
      }
      else{
        checkdata(username, password);
      }
    }
    else{
      setErrmess(true);    
    }
    };
  return (
    <div className="App">
      <div className="header">
        <h1>Keep Your Grades Up</h1>
        <button><Link to="/">Back</Link></button>
      </div>
      <div className='subhead'>Create grade leaderboards with your friends and encourage friendly competition between peers!</div>
      <div className='mainbox'>
        <div className='logo'>
          <form className='loginform'>
            {errmess && (<div className='invalid'>Invalid info!</div>)}
            {!newacc && (<input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>)}
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={(e) => handleLogin(e)}>Log In</button>
            <button type="button" onClick={() => setNewAcc(prev => !prev)}>{(newacc) ? "Create an account?":"Sign in?"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;