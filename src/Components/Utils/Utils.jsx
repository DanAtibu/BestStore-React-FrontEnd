import { Component, memo, useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { select_category } from "../../Config/Store/Category";
import { commit_product, select_product } from "../../Config/Store/Product";
import { toggle_network_loader } from "../../Config/Store/Utils";
import "./Utils.css";

function CategoryProduct({ select_fun, data: { id, Name, Price, checked } }) {
  return (
    <div className="CategoryProduct flex">
      <div className="CategoryProduct_check flex">
        <input
          type="checkbox"
          defaultChecked={checked}
          onChange={(e) => select_fun(id, e.target.checked)}
        />
        <p> {Name} </p>
      </div>
      <p> {Price} </p>
    </div>
  );
}

function SelectedProduct({
  Currency = "",
  data: { id = null, Name = "-----", Price = 0, Path = "/", Item = 0 },
}) {
  const broker = useDispatch();

  const Remove = (event) => {
    event.preventDefault();
    broker(select_product({ Product: { id }, checked: false }));
  };

  const Update = (e) => {
    e.preventDefault();
    broker(
      commit_product({ id, Item: Number(e.target.value), Name, Price, Path })
    );
  };

  return (
    <div className="SelectedProduct flex">
      <div className="SelectedProduct_product_attributes">
        <div>
          <input type="number" value={Item} onChange={Update} />
        </div>
        <div>
          <p> {Name} </p>
          <p>
            {" "}
            {Currency} {Price} / {Currency} {Item * Price}{" "}
          </p>
        </div>
      </div>
      <i className="fas fa-times icon-close" onClick={Remove}></i>
    </div>
  );
}

function Form(props) {
  var data_form = {};
  const Form_Data_Change = (e) => {
    let { name, value } = e.target;
    data_form = { ...data_form, [name]: value };
  };
  const Submit = (e) => {
    e.preventDefault();
    props.OnSubmit(data_form);
  };

  return (
    <form
      className="flex"
      autoComplete="off"
      onInput={Form_Data_Change}
      onSubmit={Submit}
    >
      {props.data.map((input) => {
        if (input.type !== "select") {
          return (
            <div>
              <label> {input.label} </label>
              <input type={input.type} name={input.name} required />
            </div>
          );
        }

        if (input.type === "select") {
          return (
            <div>
              <label> {input.label} </label>
              <select name={input.name} required>
                <option value="" disabled selected>
                  Selection Une Categorie
                </option>
                {input.options.map((item) => (
                  <option key={item.id} value={item.id}>
                    {" "}
                    {item.Name}{" "}
                  </option>
                ))}
              </select>
            </div>
          );
        }
      })}
      <div className="form-foot flex">
        <button> Enregister </button>
      </div>
    </form>
  );
}

function Modal(props) {
  return (
    <div className="Modal flex">
      <div className="Modal-Content">
        <div className="Modal-Content-Head flex">
          <p> {props.title} </p>
          <i className="fas fa-times" onClick={props.close}></i>
        </div>
        <div className="Modal-Content-body">{props.children}</div>
      </div>
    </div>
  );
}

const Loader = memo(function LoaderFun({
  timeout = 120,
  msg = "Impossible de Charger !",
  style = {},
}) {
  const [load, setload] = useState(true);
  useEffect(() => {
    let timeout_process = setTimeout(() => setload(false), timeout * 1000);
    return () => clearTimeout(timeout_process);
  }, []);
  return (
    <div className="Loader flex" style={style}>
      {load ? <div></div> : msg}{" "}
    </div>
  );
});

function Category_Selection() {
  const List = useSelector((state) => state.Category.List);
  const broker = useDispatch();

  //  SELECTION OF A CATEGORY
  let SelectedCategory = (id, checked) =>
    broker(select_category({ id, checked }));

  return (
    <div className="workspace_contenair_body_grid scroll">
      {List ? (
        List.map((category) => (
          <CategoryProduct select_fun={SelectedCategory} data={category} />
        ))
      ) : (
        <Loader timeout={120} />
      )}
    </div>
  );
}

function Product_Selection() {
  let { Product, Selected_Category, Selected_Product_Length } = useSelector(
    (state) => ({
      Product: state.Product.List,
      Selected_Category: state.Category.selected_category,
      Selected_Product_Length: state.Product.selected_product.length,
    })
  );
  let broker = useDispatch();

  let Product_To_Display = [];
  if (Product) {
    Product_To_Display = Product.filter((item) => {
      if (Selected_Category.find((cat) => cat.id === item.Category.id))
        return { ...item, checked: true };
    });
  }

  //  SELECTION OF A PRODUCT
  let SelectedProductFunction = (id, checked) => {
    let Product = Product_To_Display.find((item) => item.id === id);
    if (Product) broker(select_product({ Product, checked }));
  };

  return (
    <div
      className="workspace_contenair_body_grid"
      id="workspace_contenair_body_products"
    >
      <div className="workspace_contenair_body_product_list scroll">
        {Product ? (
          Product_To_Display.map((product) => (
            <CategoryProduct
              select_fun={SelectedProductFunction}
              key={product.id}
              data={product}
            />
          ))
        ) : (
          <Loader timeout={120} />
        )}
      </div>
      <div className="workspace_contenair_body_product_foot flex">
        <button> {Selected_Product_Length} Produit (s) Selectionner. </button>
      </div>
    </div>
  );
}

function Product_Item_To_Sale() {
  const broker = useDispatch();
  const { User, firebase, Selected_Product } = useSelector((state) => ({
    User: state.User,
    firebase: state.Utils.firebase,
    Selected_Product: state.Product.selected_product,
  }));
  var Selected_Product_ = Selected_Product.map((item) => {
    const { id = null, Name = "-----", Item = 0, Price = 0, Path } = item;
    return { id, Name, Price, Path, Item };
  });

  function Payment() {
    broker(toggle_network_loader());
    if (Selected_Product_.length)
      firebase.SaveSale(Selected_Product_, () => {
        broker(toggle_network_loader());
        alert("Achat Enregistrer.");
      });
    else alert("Aucun Produit Selectioné !");
  }

  return (
    <div
      className="workspace_contenair_body_grid"
      id="workspace_contenair_body_products"
    >
      <div className="workspace_contenair_body_product_list scroll">
        {Selected_Product_.map((Item) => (
          <SelectedProduct Currency={User.Currency} key={Item.id} data={Item} />
        ))}
      </div>
      <div className="workspace_contenair_body_product_foot flex">
        <button onClick={Payment}> Payement Effectuer </button>
      </div>
    </div>
  );
}

function SaleItem({
  Item: { Username = "----", UserId = 0, Product = [], createdAt = "----" },
}) {
  return (
    <div className="sale-item">
      <div className="sale-item-head flex">
        <p>{createdAt}</p>
        <div>
          <span>{UserId}</span> / <span>{Username}</span>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Nom Du Produit</th>
              <th>Nombre</th>
              <th>PU</th>
              <th>PG</th>
            </tr>
          </thead>
          <tbody>
            {Product.map((item) => {
              return (
                <tr>
                  <td>{item.Name.Name}</td>
                  <td>{item.Item}</td>
                  <td>{item.Price}</td>
                  <td>{item.Item * item.Price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListSale() {
  var List = useSelector((state) => state.Sale.List);
  List = List ? [...List.Sale].reverse() : [];
  return (
    <div id="sale-item-list">
      {List.map((sale) => (
        <SaleItem Item={sale} />
      ))}
    </div>
  );
}

class BasePersonnel extends Component {
  state = {
    Loading: true,
    Personnel: [],
    Form: { StoreRef_id: this.props.User.StoreRef_id },
  };

  savePersonnel = (e) => {
    e.preventDefault();
    this.props.dispatch(toggle_network_loader());
    fetch(`${this.props.Utils.backend}savePersonnel/`, {
      method: "POST",
      body: JSON.stringify(this.state.Form),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => this.newData([await res.json()]))
      .finally(() => {
        this.props.dispatch(toggle_network_loader());
      });
  };

  OnUpdate = (id, data) => {
    this.props.dispatch(toggle_network_loader());
    fetch(`${this.props.Utils.backend}updatePersonnel/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        let data = await res.json();
        data.Updated
          ? alert("Personnel Modifier ...")
          : alert("Aucun Personnel Modifier !");
      })
      .finally(() => {
        this.props.dispatch(toggle_network_loader());
      });
  };

  OnChange = ({ target: { name, value } }) => {
    this.setState((state) => ({
      ...state,
      Form: { ...state.Form, [name]: value },
    }));
  };

  newData = (data) => {
    let List = data
      .map((item) => ({
        id: item.id,
        Admin: item.Admin,
        Name: item.Name,
        Actif: item.Actif,
        Login: new Date(item.Login).toLocaleString(),
      }))
      .filter((item) => item.id !== this.props.User.Id);
    this.setState((state) => ({
      ...state,
      Personnel: [...List, ...state.Personnel],
    }));
  };

  componentDidMount() {
    fetch(
      `${this.props.Utils.backend}get_personnel/${this.props.User.StoreRef_id}`
    )
      .then(async (res) => {
        this.newData(await res.json());
      })
      .finally(() => {
        this.setState((state) => ({ ...state, Loading: !state.Loading }));
      });
  }

  render() {
    return (
      <div id="personnel_area">
        <form
          className="flex"
          onInput={this.OnChange}
          onSubmit={this.savePersonnel}
        >
          <input name="Name" placeholder="Nom" required />
          <input name="Username" placeholder="Nom D'Utilisateur" required />
          <input name="Password" placeholder="Mots de passe" required />
          <button> Enregistrer </button>
        </form>
        {this.state.Loading ? (
          <Loader timeout={90} />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Actif</th>
                <th>Nom</th>
                <th>Login</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {this.state.Personnel.map((item) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          this.OnUpdate(item.id, { Actif: e.target.checked })
                        }
                        defaultChecked={item.Actif}
                      />
                    </td>
                    <td>
                      <p>{item.Name}</p>
                    </td>
                    <td>
                      <p>{item.Login}</p>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          this.OnUpdate(item.id, { Admin: e.target.checked })
                        }
                        defaultChecked={item.Admin}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
let Personnel = connect(
  (state) => ({ Utils: state.Utils, User: state.User }),
  null
)(BasePersonnel);

function NetworkLoader() {
  const load = useSelector((state) => state.Utils.NetworkLoader);
  if (!load) return "";
  return (
    <div id="NetworkLoader" className="flex">
      <div></div>
    </div>
  );
}

export {
  CategoryProduct,
  SelectedProduct,
  Form,
  Modal,
  Loader,
  Personnel,
  Category_Selection,
  Product_Selection,
  Product_Item_To_Sale,
  NetworkLoader,
  ListSale,
};
