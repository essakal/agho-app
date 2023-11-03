import React, { useEffect, useState } from "react";
import "./product2.css";
import productsData from "./tt.json";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});

  const [grad, setGrad] = useState("aa");
  const [totalPrice, setTotalPrice] = useState(0);
  const [depenses, setDepenses] = useState(0);
  const [totalCC, setTotalCC] = useState(0); // Initialize totalCC state

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChange = (event) => {
    setGrad(event.target.value);
    calculateDepenses(event.target.value);
  };

  const addProductToSelected = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
      console.log(productId);
      return {
        ...prevSelectedProducts,
        [productId]: (prevSelectedProducts[productId] || 0) + 1,
      };
    });
  };

  const handleQuantityChange = (productId, change) => {
    setSelectedProducts((prevSelectedProducts) => {
      const updatedSelectedProducts = { ...prevSelectedProducts };
      if (updatedSelectedProducts[productId] !== undefined) {
        updatedSelectedProducts[productId] += change;
        if (updatedSelectedProducts[productId] <= 0) {
          delete updatedSelectedProducts[productId];
        }
      }
      return updatedSelectedProducts;
    });
  };

  const getProductById = (id) => {
    return productsData.find((product) => product.id === id);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    let totalCCValue = 0; // Initialize totalCCValue to 0
    for (const productId in selectedProducts) {
      const product = getProductById(parseInt(productId));
      if (product) {
        total += product.pv * selectedProducts[productId];
        totalCCValue += product.cc * selectedProducts[productId]; // Add cc * quantity to totalCCValue
      }
    }
    setTotalPrice(total);
    setTotalCC(totalCCValue); // Update totalCC state
  };

  const calculateDepenses = (selectedGrad) => {
    let depense = 0;
    for (const productId in selectedProducts) {
      const product = getProductById(parseInt(productId));
      if (product) {
        if (selectedGrad === "aa") {
          depense += product.paa * selectedProducts[productId];
        } else if (selectedGrad === "a") {
          depense += product.pa * selectedProducts[productId];
        }
      }
    }
    setDepenses(depense);
  };

  useEffect(() => {
    calculateTotalPrice();
    calculateDepenses(grad);
  }, [selectedProducts, grad]);

  const filteredProducts = productsData.filter((product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.ref.toString().includes(search)
    );
  });

  return (
    <div>
      <h1>khtar lGrad dyalek</h1>
      <select name="" id="" onChange={handleSelectChange}>
        <option value="aa">animateur adjoin</option>
        <option value="a">animateur</option>
        <option value="ma">manadjer adjoin</option>
        <option value="m">manadjer</option>
      </select>
      <div className="card-container">
        <div className="card">
          <h1>bch7al 3anbi3</h1>
          <h3>{totalPrice.toFixed(2)} DH</h3>
        </div>

        <div className="card">
          <h1>ch7al 3anekhsar</h1>
          <h3>{depenses.toFixed(2)} DH</h3>
        </div>

        <div className="card">
          <h1>ch7al 3anerba7</h1>
          <h3>{(totalPrice - depenses).toFixed(2)} DH</h3>
        </div>

        <div className="card">
          <h1>Total CC</h1>
          <h3>{totalCC.toFixed(3)} CC</h3>
        </div>
      </div>

      <h1>Selected Products</h1>
      <ul className="product-list">
        {Object.entries(selectedProducts).map(([productId, quantity]) => (
          <li className="product-card" key={productId}>
            <img
              src={require(`${getProductById(parseInt(productId)).image}`)}
              alt="Product Image"
              className="product-image"
            />
            <div className="product-details">
              <h3>{getProductById(parseInt(productId)).name}</h3>
              <p>ref: {getProductById(parseInt(productId)).ref}</p>
              <p>CC: {getProductById(parseInt(productId)).cc}</p>
              <p>PV: {getProductById(parseInt(productId)).pv} DH</p>
              {/* <p>PAA: {getProductById(parseInt(productId)).paa} DH</p> */}
              {grad === "aa" && (
                <p>PAA: {getProductById(parseInt(productId)).paa} DH</p>
              )}
              {grad === "a" && (
                <p>PA: {getProductById(parseInt(productId)).pa} DH</p>
              )}
              <div className="quantity-control">
                <button
                  onClick={() => handleQuantityChange(parseInt(productId), -1)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(parseInt(productId), 1)}
                >
                  +
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h1>Product Search</h1>
      <input
        type="text"
        placeholder="Search by name or Ref"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <h1>Product List</h1>
      <ul className="product-list">
        {filteredProducts.map((product) => (
          <li
            className="product-card"
            key={product.id}
            onClick={() => addProductToSelected(product.id)}
          >
            <img
              src={require(`${product.image}`)}
              alt="Product Image"
              className="product-image"
            />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Ref: {product.ref}</p>
              <p>CC: {product.cc}</p>
              <p>Prix Vente: {product.pv} DH</p>{" "}
              <p>Prix achat: {product.paa} DH</p>{" "}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
