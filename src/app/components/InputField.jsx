// export default function InputField({ type, placeholder, value, onChange }) {
//     return (
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         required
//         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     );
//   }
const InputField = ({ id, type, value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <input
        autoComplete="off"
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
        required
      />
      <label
        htmlFor={id}
        className="absolute left-0 -top-3.5 text-gray-600 text-sm 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 
                  peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {placeholder}
      </label>
    </div>
  );
};

export default InputField;
