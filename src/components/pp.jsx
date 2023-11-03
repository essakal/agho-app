import React, { useEffect, useState } from "react";
import productsData from "./tt.json";

export default function PP() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState({});
  const [grad, setGrad] = useState("aa");
  const [totalPrice, setTotalPrice] = useState(0);
  const [depenses, setDepenses] = useState(0);
  const [totalCC, setTotalCC] = useState(0);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChange = (event) => {
    setGrad(event.target.value);
    calculateDepenses(event.target.value);
  };

  const addProductToSelected = (productId) => {
    setSelectedProducts((prevSelectedProducts) => {
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
    let totalCCValue = 0;
    for (const productId in selectedProducts) {
      const product = getProductById(parseInt(productId));
      if (product) {
        total += product.pv * selectedProducts[productId];
        totalCCValue += product.cc * selectedProducts[productId];
      }
    }
    setTotalPrice(total);
    setTotalCC(totalCCValue);
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
      <h1 className="text-xl font-semibold">Select Grad</h1>
      <select
        className="p-2 border rounded"
        name=""
        id=""
        onChange={handleSelectChange}
      >
        <option value="aa">Animateur Adjoint</option>
        <option value="a">Animateur</option>
        <option value="ma">Manadjer Adjoint</option>
        <option value="m">Manadjer</option>
      </select>
      <div className="flex space-x-4 mt-4">
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <h1 className="text-xl font-semibold">Total Price</h1>
          <p>{totalPrice} DH</p>
        </div>
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <h1 className="text-xl font-semibold">Depenses</h1>
          <p>{depenses} DH</p>
        </div>
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <h1 className="text-xl font-semibold">Total CC</h1>
          <p>{totalCC} CC</p>
        </div>
      </div>

      <h1 className="text-xl font-semibold mt-4">Product Search</h1>
      <input
        type="text"
        className="p-2 border rounded w-full"
        placeholder="Search by name or Ref"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <h1 className="text-xl font-semibold mt-4">Selected Products</h1>
      <ul className="flex flex-wrap">
        {Object.entries(selectedProducts).map(([productId, quantity]) => (
          <li className="p-4 bg-white border rounded m-2" key={productId}>
            <img
              src={getProductById(parseInt(productId)).image}
              alt="Product Image"
              className="max-w-full h-auto rounded"
            />
            <div className="p-2">
              <h3 className="text-lg font-semibold">
                {getProductById(parseInt(productId)).name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleQuantityChange(parseInt(productId), -1)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleQuantityChange(parseInt(productId), 1)}
                >
                  +
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h1 className="text-xl font-semibold mt-4">Product List</h1>
      <ul className="flex flex-wrap">
        {filteredProducts.map((product) => (
          <li
            className="p-4 bg-white border rounded m-2 cursor-pointer"
            key={product.id}
            onClick={() => addProductToSelected(product.id)}
          >
            <img
              src={product.image}
              alt="Product Image"
              className="max-w-full h-auto rounded"
            />
            <div className="p-2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Ref: {product.ref}</p>
              <p>CC: {product.cc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
