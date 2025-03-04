export default function Table({ columns, data, actions }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 text-left">
                  {col.label}
                </th>
              ))}
              {actions && <th className="py-3 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row._id} className="border-b border-gray-300 hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.key} className="py-2 px-4">
                    {row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="py-2 px-4 flex space-x-2">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1 rounded ${action.className}`}
                        onClick={() => action.onClick(row._id)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  