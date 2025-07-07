import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const GradeEditModal = ({ isOpen, onClose, title, scheduleId }) => {
  //   const [students, setStudents] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  console.log(selectedIds);

  // Fetch grades
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/schedule/search/${scheduleId}`,
        );
        // setStudents(data);
        setRows(data); // Sync to editable state
      } catch (err) {
        console.error("Error fetching grades:", err);
      }
    };

    if (scheduleId && isOpen) fetchGrades();
  }, [scheduleId, isOpen]);

  // Handle ESC to close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row._id === id
          ? {
              ...row,
              termGrades: {
                ...row.termGrades,
                [field]: value,
              },
            }
          : row,
      ),
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const saveChanges = async () => {
    const updatedGrades = selectedIds.map((id) => {
      const row = rows.find((r) => r._id === id);
      return {
        _id: row._id,
        termGrades: row.termGrades,
      };
    });

    try {
      const res = await axios.put(
        "http://localhost:5000/api/grades/bulk",
        updatedGrades,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log("Bulk update success:", res.data);
    } catch (err) {
      console.error("Bulk update failed:", err);
    }
  };

  if (!isOpen) return null;

  const cellClass = "border-t border-zinc-200 px-4 py-3 text-left text-sm";
  const headerClass = "px-4 py-2.5 text-left text-xs font-medium text-zinc-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="animate-fade-in relative h-full w-full rounded-2xl bg-white p-6 shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X />
        </button>

        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

        <div>
          <table className="h-full w-full">
            <thead>
              <tr>
                <th className={headerClass}>Select</th>
                <th className={headerClass}>Name</th>
                <th className={headerClass}>Prelim</th>
                <th className={headerClass}>Midterm</th>
                <th className={headerClass}>Finals</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id}>
                  <td className={cellClass}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row._id)}
                      onChange={() => toggleSelect(row._id)}
                    />
                  </td>
                  <td className={cellClass}>{row.student?.name || "N/A"}</td>
                  {["prelim", "midterm", "finals"].map((term) => (
                    <td key={term} className={cellClass}>
                      <input
                        type="number"
                        value={row.termGrades?.[term] || ""}
                        onChange={(e) =>
                          handleChange(row._id, term, Number(e.target.value))
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {selectedIds.length > 0 && (
            <button
              onClick={saveChanges}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Save Changes ({selectedIds.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeEditModal;
