import './App.css';
import Home from './Components/Home/Home';
import WorkSpace from './Components/WorkSpace/WorkSpace';
import { Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar/NavBar';
import Page400 from './Components/PageError/Page400/Page400';
import { Component } from 'react';
import { connect, useSelector} from "react-redux";
import { updateCategory } from './Config/Store/Category';
import { updateProduct } from './Config/Store/Product';
import { updateStock } from './Config/Store/Stock';
import { updateSale } from './Config/Store/Sale';
import Connexion from './Components/Connexion/Login';
import { NetworkLoader } from './Components/Utils/Utils';



class AppFun extends Component {

  componentDidMount = () => {

    console.log( this.props.User );

    this.props.firebase.Init( this.props.User ).then( () => {
      // this.props.firebase.User = this.props.User
      // {
        // Username: "ATIBU DAN",
        // Store: "Total-Up", Id: Math.floor( Math.random() * 5 )
      // }


      const DT = new Date();
      const fireDate = `${ DT.getFullYear() }-${ DT.getMonth() + 1 }-${ DT.getDate() }`;


      // LOAD CATEGORY
      this.props.firebase.GetCategory(( response_category ) => {
        this.props.dispatch( updateCategory( response_category ) );
      });



     // LOAD PRODUCT
     this.props.firebase.GetProduct(( response_product ) => {
        this.props.dispatch( updateProduct( response_product ) );
      });


      // LOAD STOCK
      // this.props.firebase.GetDocument(`Stock/${fireDate }`, false, ( response_stock ) => {
      //   this.props.dispatch( updateStock( response_stock ) );
      // });

      
      // LOAD SALES
      this.props.firebase.GetSale(`Sale/${fireDate}`, ( response_sale ) => {
        this.props.dispatch( updateSale( response_sale ) );
      });
    
    });
  }
  
  
  


  render () {
    return <>
      <NavBar />
      <NetworkLoader />
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/Workspace' element={ <WorkSpace /> } />
        <Route path='/*' element={ <Page400 /> } />
      </Routes>
    </>
  }
}

const AppFunWraper = connect(( state ) => {
  return {firebase: state.Utils.firebase, User: state.User };
}, null )( AppFun );


export default function App() {
  const { User } = useSelector(( state ) => {
    return { User: state.User };
  })
  if ( !User.Id ) {
    return <Connexion />
  }
  return <AppFunWraper />
}



