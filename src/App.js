import React, { Component } from 'react';
import firebase from 'firebase';

import FileUpload from './FileUpload';  

import './App.css';

class App extends Component {

  constructor () {
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogut = this.handleLogut.bind(this);
    this.handleUpload = this.handleUpload.bind(this);

  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });     
         
    });     
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogut(){
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} has salido de la sesión`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }


  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
            uploadValue: percentage
        })
    }, error => { 
        console.log(error.message)
    }, ()=> {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
}

  renderLoginButton () {
    // si el usuario está logueado
    if (this.state.user) {
      return (
        <div>
           <img width="150" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
           <p>Hola {this.state.user.displayName}! </p>
           <button onClick={this.handleLogut}>Salir</button>

           <FileUpload onUpload={this.handleUpload} />

           {
             this.state.pictures.map(picture => (
               <div>
                  <img src={picture.image} />
                  <br/>
                  <img  width="50" src={picture.photoURL} alt={picture.displayName} />
                  <br/>
                  <span>{picture.displayName}</span>

               </div>
             )).reverse()
           }
        </div>
      );
    } else {
      return(
      <button onClick={this.handleAuth}>Login con Google</button> 
    // si no lo está 
      );
    }

  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>VantexGram</h2>
        </header>
        <p className="App-intro">
          { this.renderLoginButton() }
        </p>
      </div>
    );
  }
}

export default App;
