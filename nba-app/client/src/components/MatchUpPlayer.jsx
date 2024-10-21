const Player = ({ player, onDelete }) => {
  return (
    <li className="flex justify-between items-center mb-2">
      <span>{player}</span>
      <button className="btn btn-sm btn-error" onClick={onDelete}>
        Delete
      </button>
    </li>
  );
};

export default Player;
