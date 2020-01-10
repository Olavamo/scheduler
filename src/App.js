import React, { useState, useEffect } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Message } from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CourseList, { addScheduleTimes } from './components/CourseList';

const firebaseConfig = {
  apiKey: "AIzaSyC_gJJM8Zg6deCUcTodjTgOovcoft_2rFw",
  authDomain: "scheduler-northwestern.firebaseapp.com",
  databaseURL: "https://scheduler-northwestern.firebaseio.com",
  projectId: "scheduler-northwestern",
  storageBucket: "scheduler-northwestern.appspot.com",
  messagingSenderId: "605171660130",
  appID: "1:605171660130:web:ad50a9db6449a04c4f683b",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[ loading... ]' }</Title>
  </React.Fragment>
);

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <Container>
      <Banner title={ schedule.title}  user={ user } />
      <CourseList courses={ schedule.courses }  user={ user } />
    </Container>
  );
};

export default App;
export { db };