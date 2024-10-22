import { useState } from 'react';
import Injury from './Injury';

const InjuryReport = ({ team, injuries, onAddInjury, onEditInjury, onResolveInjury }) => {
  const [player, setPlayer] = useState('');
  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    onAddInjury(team, player, result, description);
    setPlayer('');
    setResult('');
    setDescription('');
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Injury Reports</h3>
      <ul>
        {injuries.map((injury, index) => (
          <Injury
            key={index}
            injury={injury}
            onEdit={(updatedInjury) => onEditInjury(index, updatedInjury)}
            onResolve={() => onResolveInjury(index)}
          />
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Player"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="input input-bordered mb-2"
        />
        <input
          type="text"
          placeholder="Result"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="input input-bordered mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-bordered mb-2"
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Injury
        </button>
      </div>
    </div>
  );
};

export default InjuryReport;
