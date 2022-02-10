import React, {useRef, useState} from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


//import 'firebase/analytics';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
//import firebase from 'firebase';
//import firebase from 'firebase'
require('firebase/auth');



firebase.initializeApp({

  apiKey: "AIzaSyDvgxrQGQ5lx09SYvaVGNSkgYDqRTHeszA",

  authDomain: "chat-bb1b8.firebaseapp.com",

  projectId: "chat-bb1b8",

  storageBucket: "chat-bb1b8.appspot.com",

  messagingSenderId: "736621716320",

  appId: "1:736621716320:web:594810dfa963707e027405",

  measurementId: "G-SVBQ4L7RKS"

})




const auth= firebase.auth();
const firestore= firebase.firestore();
//const analytics= firebase.analytics();

function App(){
  const[user] = useAuthState(auth);
return(
  <div className="App">
    <header>
<SignOut/>
    </header>
    <section>
      {user ? <ChatRoom /> : <SignIn />}
    </section>
  </div>
);
}

function SignIn()
{
  const signInWithGoogle = () =>{ 
    const provider= new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }
return(
  <>
  <button className="sign-in" onClick={signInWithGoogle}> Sign in with Google</button>
  <p>
    Do not violate the guidelines!
  </p>
  </>
)
}

function SignOut()
{
  return auth.currentUser && (

    <button className="sign-out" onClick={()=> auth.signOut()}> Sign Out</button>
  )
}

function ChatRoom()
{
  const dummy= useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);


  const [messages] = useCollectionData(query, {idField: 'id'});
const [formValue, setFormValue]= useState('');

const sendMessage = async(e)=> {
   e.preventDefault();
   const{uid, photoURL}= auth.currentUser;
   await messagesRef.add({
     text: formValue,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     uid,
     photoURL
   })
   setFormValue('');

   dummy.current.scrollIntoView({ behavior: 'smooth'});

}

  return(
    <>
    
<main>
  {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  <span ref = {dummy}></span>
</main>

<form onSubmit={sendMessage}>
<input value = {formValue} onChangeCapture={(e)=> setFormValue(e.target.value)} placeholder="say nice"/>

<button type = "submit" disabled={!formValue}> </button>

</form>



    </>
  )

}

function ChatMessage(props)
{
const { text, uid, photoURL} =props.message;

const messageClass =uid ===auth.currentUser.uid ? 'sent' : 'received';
return(<>
  
  <div className={`message ${messageClass}`}>
  
    <img src = {photoURL} alt="" />

    <p>{text}</p>
  </div>
  </>
)

}
export default App;