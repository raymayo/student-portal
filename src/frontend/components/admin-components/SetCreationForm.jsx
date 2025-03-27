import React from 'react'
import {useState, useEffect} from 'react'

const SetCreationForm = () => {

    const allYear = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];


  return (
    <div className='w-full h-full grid grid-cols-2 gap-6'>
        <form>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">Department</h1>
                <select name="" id="" className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">Department</select>
            </label>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">areaOfStudy</h1>
                <select name="" id="" className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">Course</select>
            </label>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">yearLevel</h1>
                <select name="" id="" className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">Year Level</select>
            </label>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">Set Name</h1>
                <select name="" id="" className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">Year Level</select>
            </label>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">yearLevel</h1>
                <select name="" id="" className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">Year Level</select>
            </label>
            <div>
					<h1 className="text-sm font-medium mb-1">Academic Year</h1>
					<label className="w-full flex gap-2">
						<select
							name="yearStart"
							required
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						</select>
						<select
							name="yearEnd"
							required
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
							>
						</select>
					</label>
				</div>

                <div className='mt-6'>
            <h1 className="text-xl font-medium">Add Schedule to Set</h1>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">Pick Course</h1> 
                <select name="" id="" className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">Course</select>
            </label>
            <button>add schedule</button>
        </div>
        </form>

        <div>
            <h1 className="text-xl font-medium">List of Schedule</h1>
            <div>
                <table></table>
            </div>
        </div>
    </div>
  )
}

export default SetCreationForm