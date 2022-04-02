import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  toggle_personnel_modal,
  toggle_category_modal,
  toggle_product_modal,
  toggle_network_loader,
  toggle_sale_list_modal,
} from "../../Config/Store/Utils";
import { addDoc, Timestamp } from "firebase/firestore";
import { Form, ListSale, Modal, Personnel } from "../Utils/Utils";

export default function NavBar() {
  const broker = useDispatch();
  const {
    User,
    Category,
    Utils: {
      firebase,
      sale_list_modal,
      personnel_modal,
      category_modal,
      product_modal,
    },
  } = useSelector((state) => ({
    User: state.User,
    Utils: state.Utils,
    Category: state.Category,
  }));

  function modal_sale_toggle_funtion() {
    broker(toggle_sale_list_modal());
  }
  function modal_personnel_toggle_funtion() {
    broker(toggle_personnel_modal());
  }
  function modal_category_toggle_funtion() {
    broker(toggle_category_modal());
  }
  function modal_product_toggle_funtion() {
    broker(toggle_product_modal());
  }

  const category_form_data = [
    { name: "Name", type: "text", label: "Nom De La Category" },
  ];
  const product_form_data = [
    { name: "Name", type: "text", label: "Nom Du Produit" },
    { name: "Price", type: "number", label: "Prix Du Produit" },
    {
      name: "Category",
      type: "select",
      label: "Category",
      options: Category.List ? Category.List : [],
    },
  ];

  const OnSubmit_Category = (data) => {
    data.createdAt = Timestamp.fromDate(new Date());
    broker(toggle_network_loader());
    addDoc(firebase.Category, data).then(() => {
      broker(toggle_network_loader());
      alert("Categorie Enregistrer !");
    });
  };

  const OnSubmit_Product = (data) => {
    let Category_Ref = firebase.CategoriesDocs.find(
      (item) => item.id === data.Category
    );
    if (Category_Ref) {
      data.Category = Category_Ref.doc.ref;
      data.Price = Number(data.Price);
      data.createdAt = Timestamp.fromDate(new Date());
      broker(toggle_network_loader());
      addDoc(firebase.Product, data).then(() => {
        broker(toggle_network_loader());
        alert("Produit Enregistrer !");
      });
    } else {
      alert("Oop, La Reference A La Category A Echoue !");
    }
  };

  return (
    <div id="navbar" className="flex">
      {personnel_modal && (
        <Modal title="Personnel" close={modal_personnel_toggle_funtion}>
          <Personnel />
        </Modal>
      )}
      {category_modal && (
        <Modal title="Categorie" close={modal_category_toggle_funtion}>
          <Form OnSubmit={OnSubmit_Category} data={category_form_data} />
        </Modal>
      )}
      {product_modal && (
        <Modal title="Produit" close={modal_product_toggle_funtion}>
          <Form OnSubmit={OnSubmit_Product} data={product_form_data} />
        </Modal>
      )}
      {sale_list_modal && (
        <Modal title="Produit" close={modal_sale_toggle_funtion}>
          <ListSale />
        </Modal>
      )}

      <div id="navbar_section_one">
        <div>
          <i className="fas fa-bars"></i>
        </div>
        <Link to="/">
          <div>
            <i className="fa-brands fa-gripfire"></i>
            <p> Dashboard </p>
          </div>
        </Link>
        <Link to="/Workspace">
          <div>
            <i className="fas fa-file"></i>
            <p> WorskSpace </p>
          </div>
        </Link>
        {User.Admin && (
          <div onClick={modal_personnel_toggle_funtion}>
            <i className="fas fa-users"></i>
            <p> Personnel </p>
          </div>
        )}

        <div onClick={modal_sale_toggle_funtion}>
          <i className="fas fa-users"></i>
          <p> Sale </p>
        </div>

        <div onClick={modal_category_toggle_funtion}>
          <i className="fas fa-object-ungroup"></i>
          <p> Category </p>
        </div>

        <div onClick={modal_product_toggle_funtion}>
          <i className="fa-solid fa-cart-shopping"></i>
          <p> Product </p>
        </div>
      </div>
      <div id="navbar_section_two" className="flex">
        <p>
          {" "}
          Username : {User.Username} / Admin : {User.Admin ? "Yes" : "Non"}{" "}
        </p>
      </div>
    </div>
  );
}
