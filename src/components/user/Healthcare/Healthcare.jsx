import React from "react";
import "./Healthcare.scss"; // Import a CSS file for custom styles

const Healthcare = () => {
  return (
    <div className="healthcare h-100 d-flex flex-column p-4">
      <h1 className="fw-bold text-center mb-4">Healthcare</h1>
      
      <div className="w-100 d-flex gap-3 h-75">
        <div className="w-50 d-flex flex-column">
          <input
            type="text"
            className="form-control rounded-4"
            placeholder="Enter symptoms"
          />
        </div>

        <div className="w-50 d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control rounded-4"
            placeholder="Enter diagnosis"
          />
          <input
            type="text"
            className="form-control rounded-4"
            placeholder="Enter examination details"
          />
        </div>
      </div>

      {/* Medical Examination Process Section */}
      <div className="w-100 border rounded-4 mt-3 p-3">
        <h4 className="mb-3">Medical Examination Process</h4>
        <div className="d-flex gap-3 align-items-center">
          <select name="medicine" className="form-select rounded-4 flex-grow-1">
            <option value="">Select Medicine</option>
            <option value="pandon">Pandon</option>
            <option value="medicine1">Medicine 1</option>
            <option value="medicine2">Medicine 2</option>
            <option value="medicine3">Medicine 3</option>
          </select>
          <input
            type="text"
            placeholder="Dosage"
            className="form-control rounded-4"
          />
        </div>
        <div className="h-25 border rounded-4 mt-3 p-2">
          <span>Medicine Selected</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3 ms-auto mt-4">
        <button className="btn btn-primary">Save</button>
        <button className="btn btn-secondary">PDF Export</button>
      </div>
    </div>
  );
};

export default Healthcare;