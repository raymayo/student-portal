import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, SquareAsterisk, Square } from "lucide-react";

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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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
      );
      console.log("Bulk update success:");
      alert("Grades updated successfully!");
      setSelectedIds([]); // Clear selection after save
    } catch (err) {
      console.error("Bulk update failed:", err);
    }
  };

  if (!isOpen) return null;

  const cellClass =
    "border-t border-zinc-200 px-4 py-3 text-left text-sm accent-zinc-900";
  const headerClass =
    "px-4 py-2.5 text-left text-xs font-medium text-zinc-500 ";

  const handleCheckAll = () => {
    if (selectedIds.length === rows.length) {
      setSelectedIds([]); // Uncheck all
    } else {
      const allIds = rows.map((row) => row._id);
      setSelectedIds(allIds); // Check all
    }
  };

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

        <div className="max-w-full border">
          <table className="h-full w-full">
            <thead>
              <tr>
                <th className={headerClass + " flex items-center gap-1"}>
                  <button
                    onClick={handleCheckAll}
                    className="flex cursor-pointer items-center justify-center text-left text-sm text-zinc-900"
                  >
                    {selectedIds.length === rows.length ? (
                      <SquareAsterisk size={20} />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </th>
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
                      className="cursor-pointer"
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
        </div>
        {selectedIds.length > 0 && (
          <button
            onClick={saveChanges}
            className="mt-4 rounded bg-zinc-950 px-4 py-2 text-white"
          >
            Save ({selectedIds.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default GradeEditModal;
