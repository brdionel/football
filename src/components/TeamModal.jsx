// 2️⃣ TeamModal.jsx
const TeamModal = ({ team, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">{team.name}</h2>
        <p>
          <strong>Country:</strong> {team.country}
        </p>
        <p>
          <strong>League:</strong> {team.league}
        </p>
        <p>
          <strong>Titles:</strong> {team.titles}
        </p>
        <p>
          <strong>Founded:</strong> {team.founded}
        </p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TeamModal;
