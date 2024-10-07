import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

const TeamSelectionPage = () => {
  const location = useLocation();
  const [leftValue, setLeftValue] = useState(location.state?.leftValue || '');
  const [rightValue, setRightValue] = useState(location.state?.rightValue || '');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { leftValue, rightValue };
    navigate('/injury', { state: data });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Team Selection</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <div className="flex justify-between w-full max-w-md">
          <label className="form-control w-full max-w-xs mr-4">
            <div className="label">
              <span className="label-text">Home Team</span>
            </div>
            <select
              className="select select-bordered"
              value={leftValue}
              onChange={(e) => setLeftValue(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Pick one</option>
              {/* {teams
                .filter(team => team.name !== rightValue)
                .map(team => (
                  <option key={team._id} value={team.name}>{team.name}</option>
                ))} */}
              <optgroup label="Category 1">
                <option value="Option1-1">Option 1-1</option>
                <option value="Option1-2">Option 1-2</option>
              </optgroup>
              <optgroup label="Category 2">
                <option value="Option2-1">Option 2-1</option>
                <option value="Option2-2">Option 2-2</option>
              </optgroup>
            </select>
          </label>
          <label className="form-control w-full max-w-xs ml-4">
            <div className="label">
              <span className="label-text">Away Team</span>
            </div>
            <select
              className="select select-bordered"
              value={rightValue}
              onChange={(e) => setRightValue(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Pick one</option>
              {/* {teams
                .filter(team => team.name !== leftValue)
                .map(team => (
                  <option key={team._id} value={team.name}>{team.name}</option>
                ))} */}
              <optgroup label="Category A">
                <option value="OptionA-1">Option A-1</option>
                <option value="OptionA-2">Option A-2</option>
              </optgroup>
              <optgroup label="Category B">
                <option value="OptionB-1">Option B-1</option>
                <option value="OptionB-2">Option B-2</option>
              </optgroup>
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </form>
    </div>
  );
};

export default TeamSelectionPage;
