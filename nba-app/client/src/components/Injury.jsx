import { useState } from 'react';

const Injury = ({ injury, onEdit, onResolve }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [player, setPlayer] = useState(injury.player);
  const [result, setResult] = useState(injury.result);
  const [description, setDescription] = useState(injury.description);

  const handleSave = () => {
    onEdit({ ...injury, player, result, description });
    setIsEditing(false);
  };

  return (
    <li className="mb-2">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            className="input input-bordered mb-2"
          />
          <input
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="input input-bordered mb-2"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered mb-2"
          />
          <button className="btn btn-sm btn-primary mr-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>Player: {injury.player}</p>
          <p>Result: {injury.result}</p>
          <p>Description: {injury.description}</p>
          <p>Status: {injury.resolved ? 'Resolved' : 'Unresolved'}</p>
          <button className="btn btn-sm btn-primary mr-2" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="btn btn-sm btn-secondary" onClick={onResolve}>
            Resolve
          </button>
        </div>
      )}
    </li>
  );
};

export default Injury;
