import React, { Component } from "react";
import Card from "./Card";
import "./Home.css";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { connect } from "react-redux";
import { Loader } from "../Utils/Utils";

class Home extends Component {
  GenerateData = () => {
    let [Names, Values] = this.ChartData();
    return {
      labels: Names,
      datasets: [
        {
          data: Values,
          backgroundColor: "rgba(77, 207, 99, 0.4)",
          borderWidth: 5,
          borderRadius: 2,
          tension: 0.3,
          fill: false,
          options: {
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: "rgb(255, 99, 132)",
                },
              },
            },
          },
        },
      ],
    };
  };
  ChartData = () => {
    if (!this.props.Sale.List) return [];
    let Data = {};
    for (let sale of this.props.Sale.List.Sale) {
      for (let product of sale.Product) {
        if (!Data[product.Name.id]) Data[product.Name.id] = 0;
        Data[product.Name.id] += product.Item;
      }
    }

    let Names = [];
    let Values = [];

    for (let key in Data) {
      let { Name = "---" } = this.props.Product.List.find(
        (item) => item.id === key
      );
      Names.unshift(Name);
      Values.unshift(Data[key]);
    }
    return [Names, Values];
  };

  ParseData = () => {
    let TotalAmount = 0;
    let PersonelAmount = 0;
    let TotalSale = 0;
    let PersonelSale = 0;

    if (this.props.Sale.List) {
      TotalSale = this.props.Sale.List.Sale.length;
      this.props.Sale.List.Sale.forEach((element) => {
        if (element.UserId === this.props.User.Id) PersonelSale++;
        for (let PS of element.Product) {
          let amount = PS.Item * PS.Price;
          if (element.UserId === this.props.User.Id) PersonelAmount += amount;
          TotalAmount += amount;
        }
      });
    }
    return { TotalAmount, PersonelAmount, TotalSale, PersonelSale };
  };

  render() {
    const { TotalAmount, PersonelAmount, TotalSale, PersonelSale } =
      this.ParseData();
    return (
      <section>
        <div id="home_info">
          <h2> Welcome, {this.props.User.Name} </h2>
          <p>{new Date(this.props.User.Login).toLocaleString()}</p>
        </div>

        <div id="home_cards_list" className="flex">
          <Card
            title="Montant Total"
            value={`${this.props.User.Currency} ${TotalAmount}`}
            icon="fas fa-dollar"
          />
          <Card
            title="Montant Personnel"
            value={`${this.props.User.Currency} ${PersonelAmount}`}
            icon="fas fa-dollar"
            borderColor="235, 65, 59"
          />
          <Card
            title="Total Achat / Jour"
            value={TotalSale}
            icon="fas fa-briefcase"
            borderColor="235, 209, 59"
          />
          <Card
            title="Achat Personnel / Jour"
            value={PersonelSale}
            icon="fa-solid fa-cart-flatbed"
            borderColor="77, 207, 99"
          />
        </div>

        <div id="home_detail">
          <div id="home_chart_contenair">
            <Chart type="line" data={this.GenerateData()} responsive="true" />
          </div>

          <div id="home_table_contenair">
            <div id="home_table_contenair_product_list">
              {this.props.Product.List ? (
                this.props.Product.List.map((item, index) => (
                  <Home_Product key={item.id} item={item} index={index} />
                ))
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function Home_Product({ index, item: { Price = 0, Name = "--" } }) {
  return (
    <div className="home_table_contenair_product flex">
      <div className="flex">
        <p>{index}</p>
        <span>{Name}</span>
      </div>
      <p>{Price}</p>
    </div>
  );
}

export default connect((state) => state, null)(Home);
