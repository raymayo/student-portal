import Set from "../models/Set.js";
import Schedule from "../models/Schedule.js";

export const getAllSets = async (req, res) => {
    try {
        const sets = await Set.find().populate("schedules").populate("students", "name email");
        res.status(200).json(sets);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Sets." });
    }
};

export const createSet = async (req, res) => {
    try {
      const { name, yearLevel, department, areaOfStudy, scheduleIds } = req.body;
  
      // Validate schedule IDs
      const schedules = await Schedule.find({ _id: { $in: scheduleIds } });
      if (schedules.length !== scheduleIds.length) {
        return res.status(400).json({ message: "One or more schedules not found" });
      }
  
      // Create new set
      const newSet = new Set({
        name,
        yearLevel,
        department,
        areaOfStudy,
        schedules: scheduleIds,
      });
  
      await newSet.save();
  
      // Update each schedule to include the Set reference (if needed)
      await Schedule.updateMany(
        { _id: { $in: scheduleIds } },
        { $set: { set: newSet._id } } // Assuming 'set' field exists in Schedule schema
      );
  
      res.status(201).json(newSet);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  




export const autoAssignStudentsToSet = async (req, res) => {
    
    
    try {
        const students = await Student.find().populate("currentSubjects");

        for (const student of students) {
            const setCounts = {}; // Count occurrences of each Set

            for (const schedule of student.currentSubjects) {
                const scheduleSet = await Set.findOne({ schedules: schedule._id });
                if (scheduleSet) {
                    setCounts[scheduleSet._id] = (setCounts[scheduleSet._id] || 0) + 1;
                }
            }

            if (Object.keys(setCounts).length > 0) {
                // Find the Set with the highest schedule count
                let bestSetId = null;
                let maxCount = 0;
                let highestYearLevel = 0;

                for (const [setId, count] of Object.entries(setCounts)) {
                    const set = await Set.findById(setId).populate("schedules");
                    const setYearLevel = Math.max(...set.schedules.map(sch => sch.yearLevel), 0);

                    if (count > maxCount || (count === maxCount && setYearLevel > highestYearLevel)) {
                        bestSetId = setId;
                        maxCount = count;
                        highestYearLevel = setYearLevel;
                    }
                }

                if (bestSetId) {
                    student.set = bestSetId;
                    await student.save();

                    const set = await Set.findById(bestSetId);
                    if (!set.students.includes(student._id)) {
                        set.students.push(student._id);
                        await set.save();
                    }
                }
            }
        }

        res.status(200).json({ message: "Students auto-assigned to Sets successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to auto-assign students." });
    }
};


export const manualAssignStudentToSet = async (req, res) => {
    try {
        const { setId, studentId } = req.params;

        const set = await Set.findById(setId);
        if (!set) return res.status(404).json({ message: "Set not found." });

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found." });

        // Remove student from previous Set
        if (student.set) {
            const prevSet = await Set.findById(student.set);
            if (prevSet) {
                prevSet.students = prevSet.students.filter(id => id.toString() !== studentId);
                await prevSet.save();
            }
        }

        // Assign student to the new Set
        student.set = setId;
        await student.save();

        if (!set.students.includes(studentId)) {
            set.students.push(studentId);
            await set.save();
        }

        res.status(200).json({ message: "Student manually assigned to Set.", student });
    } catch (error) {
        res.status(500).json({ message: "Failed to manually assign student." });
    }
};
