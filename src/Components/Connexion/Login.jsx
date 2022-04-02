import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { login } from "../../Config/Store/User";
import { toggle_network_loader } from "../../Config/Store/Utils";
import { NetworkLoader } from "../Utils/Utils";
import "./Login.css";

function Form(props) {
  var data = {};
  function OnFormChange(e) {
    e.preventDefault();
    let { name, value } = e.target;
    data = { ...data, [name]: value };
  }

  function OnSubmit(e) {
    e.preventDefault();
    props.Click(data);
  }

  return (
    <form
      onSubmit={OnSubmit}
      onInput={OnFormChange}
      id="connexion_form"
      className="flex"
      autoComplete="off"
    >
      {props.Input.map((input) => (
        <input key={input.name} {...input} required />
      ))}
      <button> {props.Button} </button>
    </form>
  );
}

function Login() {
  const host = useSelector((state) => state.Utils.backend);
  const broker = useDispatch();
  const navigator = useNavigate();

  let Input = [
    { name: "Username", placeholder: "Username" },
    { name: "Password", type: "password", placeholder: "Password" },
  ];
  function Click(data) {
    broker(toggle_network_loader());
    fetch(`${host}login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (data) => {
        let res = await data.json();
        if (res.Response) {
          broker(login(res.Obj));
        } else {
          alert("Identifiant Incorrect !");
        }
      })
      .catch((er) => alert("Un Probleme  A Etait Trouvé !"))
      .finally(() => {
        navigator("/");
        broker(toggle_network_loader());
      });
  }
  return (
    <Form
      Click={Click}
      Input={Input}
      Button="Connexion"
      Text="Create an acount"
      Link="sign-up"
    />
  );
}

function SignUp() {
  const host = useSelector((state) => state.Utils.backend);
  const broker = useDispatch();
  const navigator = useNavigate();

  let Input = [
    { name: "Name", placeholder: "Nom" },
    {
      name: "Actif",
      placeholder: "Actif",
      type: "checkbox",
      checked: true,
      hidden: true,
    },
    { name: "Username", placeholder: "Username" },
    { name: "Password", type: "password", placeholder: "Password" },
    {
      name: "Admin",
      placeholder: "Company Admin",
      type: "checkbox",
      checked: true,
      hidden: true,
    },
    { name: "StoreRef", placeholder: "Company Name" },
    {
      name: "Currency",
      placeholder: "Monnaie          Example: $, Euro, BIF, ...",
    },
  ];
  console.log(`${host}create`);
  function Click(data) {
    console.log(data);
    broker(toggle_network_loader());
    fetch(`${host}create`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (data) => {
        let res = await data.json();
        if (res.Response) {
          broker(login(res.Obj));
        } else {
          alert("Enregistrement Echoue !");
        }
        console.log(res);
      })
      .catch((er) => alert("Enregistrement Echoue !"))
      .finally(() => {
        navigator("/");
        broker(toggle_network_loader());
      });
  }
  return (
    <Form
      Click={Click}
      Input={Input}
      Button="Enregister"
      Text="connexion ?"
      Link="login"
    />
  );
}

function Connexion() {
  const navigator = useNavigate();
  useEffect(() => {
    navigator("/login");
  }, []);
  return (
    <div id="user_connexion" className="flex">
      <NetworkLoader />
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
      <div id="connexion_form_option">
        <Link to="login"> login ? </Link>
        <Link to="sign-up"> sign-up ? </Link>
      </div>
    </div>
  );
}

export default Connexion;
