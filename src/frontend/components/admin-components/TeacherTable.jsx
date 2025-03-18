import React from 'react'
import { useState, useEffect } from "react";

const TeacherTable = () => {


    const [teacher, setTeacher] = useState([]);


    useEffect(() => {
        const fetchTeachers =  async() => {
            try{
                const response = await axios.get("http://localhost:5000/api/users?role=teacher")
                setTeacher(response.data);
                console.log(teacher)
            }catch(err){
                console.error("error fetching", err)
            }
        }

        fetchTeachers();
    }, [])

  return (
    <div>TeacherTable</div>
  )
}

export default TeacherTable