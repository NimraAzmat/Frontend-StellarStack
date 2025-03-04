export default function Button({ type, children, onClick }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
      >
        {children}
      </button>
    );
  }
  