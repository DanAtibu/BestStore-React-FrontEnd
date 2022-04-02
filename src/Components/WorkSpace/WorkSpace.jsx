import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Category_Selection, Product_Item_To_Sale, Product_Selection, SelectedProduct } from '../Utils/Utils';
import "./WorkSpace.css";


class WorkSpace extends Component {
  render() {
    return (
      <section id='workspace' className='flex'>

        <div id='workspace_contenair'>

          <div id='workspace_contenair_header' className='flex'> Total Payed : 9000 </div>
          <div id='workspace_contenair_body' className='flex'>
              <Category_Selection />           
              <Product_Selection />
              <Product_Item_To_Sale />
          </div>
        
        </div>

      </section>
    )
  }
}







export default connect( state => {
  return { Category: state.Category, Product: state.Product }
}, null)( WorkSpace );