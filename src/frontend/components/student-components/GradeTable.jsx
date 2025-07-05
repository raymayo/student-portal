import React from "react";

const GradeTable = () => {
  return (
    <div>
      <nav>
        <input type="text" />
        <button>Search</button>
      </nav>
      <div className="w-full">
        <table className="w-full border">
          <thead className="w-full">
            <tr className="w-full">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Student ID
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Name
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Course
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Year Level
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Example row, replace with dynamic data */}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeTable;
