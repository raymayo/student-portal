import React from 'react'
import {useState, useEffect} from 'react'

const SetCreationForm = () => {


  return (
    <div>
        <form>
            <label>
                Department
                <select name="" id="">Department</select>
            </label>
            <label>
                areaOfStudy
                <select name="" id="">Course</select>
            </label>
            <label>
                yearLevel
                <select name="" id="">Year Level</select>
            </label>
        </form>

        <div>
            <h1>List of Schedules</h1>
            <label>
                Pick Course
                <select name="" id="">Course</select>
            </label>
        </div>
    </div>
  )
}

export default SetCreationForm