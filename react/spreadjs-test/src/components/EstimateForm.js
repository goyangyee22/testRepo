import React, { useState } from "react";

const EstimateForm = ({ addEstimate }) => {
  const [estimate, setEstimate] = useState({
    id: "",
    item: "",
    quantity: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstimate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEstimate(estimate);
    setEstimate({ id: "", item: "", quantity: "", price: "" }); // Clear form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={estimate.id}
        onChange={handleChange}
        placeholder="ID"
        required
      />
      <input
        type="text"
        name="item"
        value={estimate.item}
        onChange={handleChange}
        placeholder="Item"
        required
      />
      <input
        type="number"
        name="quantity"
        value={estimate.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <input
        type="number"
        name="price"
        value={estimate.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <button type="submit">Add Estimate</button>
    </form>
  );
};

export default EstimateForm;
