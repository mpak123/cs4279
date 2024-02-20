"use client";

import React, { useState } from "react";
import "./editProfileForm.css";

interface EditProfileFormProps {
  name: string;
  email: string;
  phoneNumber: string;
  onSubmit: (data: {
    name: string;
    email: string;
    phoneNumber: string;
  }) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  name,
  email,
  phoneNumber,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({ name, email, phoneNumber });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfileForm;