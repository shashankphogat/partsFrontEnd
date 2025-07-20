import './App.css'
import { useState } from 'react';
import { useEffect } from 'react';

const defects=[
"casting","machining"
]

const castingSubDefects=[
{code:'C29',label:'Dent Mark / Contusion'},{code:'C19',label:'Dirt Inclusion'},{code:'C13',label:'Rough Surface'},{code:'C13',label:'Kajari'},
  {code:'C6',label:'Blowhole'},{code:'C8',label:'Oxide Inclusions'},{code:'C90',label:'Over Grinding'},{code:'C5',label:'Shrinkage'},{code:'C31',label:'Pin Hole'},
  {code:'C11',label:'Cold Lap'},{code:'C2',label:'Crack'},{code:'C14',label:'Diecoat Peel-Off'},{code:'C98',label:'Unmachined'},{code:'C99',label:'Casting Other'},{code:'C6',label:'Flange'}
]

const machiningSubDefects = [
  {code:'M16',label:'Machining dent hub'},{code:'M16',label:'Bore'},{code:'M14',label:'Un Machined'},{code:'M11',label:'Broken Chips'},{code:'M10',label:'Chamfer Error'},{code:'M90',label:'Over Grinding'},
  {code:'M99',label:'M/C Others'},{code:'M15',label:'Machining Mark'},{code:'M',label:'Deburring Tool Mark'},{code:'M',label:'Burr'},
  {code:'M',label:'Chip Sticking'},{code:'M',label:'Scratch'},{code:'M',label:'Disk Dent'},{code:'M',label:'Step'}
];

const models=[
  "YCA","Y0M","YCA-QC8"
]

const modelStates=[
  {
type:"Rework",
value:0
  },
  {
type:"Accept",
value:1
  },
  {
type:"Reject",
value:2
  }
]


function App() {
const [formData,setFormData]=useState({})
const [subDefects,setSubDefects]=useState([])
const [defectsValid,setDefectsValid]=useState(false)
const [hourlyReportModel, setHourlyReportModel] = useState("");

const handleChange=(e)=>{
setFormData(
  {...formData,[e.target.id]:e.target.value}
)

}

const handleSubmit=async (e)=>{
  e.preventDefault();
  console.log(formData)
  await fetch('/api/addPartsData', {
      method: 'POST',
      body: JSON.stringify({
        ...formData
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      },
   })
}

const handleReport = async (type,model) => {
    if(type==="inspection"){
    await fetch("/api/generate-inspection-report")
    }else
      if(type==="pareto"){
         await fetch("/api//generate-pareto-report")
      }
    else if (type==="trend"){
       await fetch("/api/send-model-trend")
    }
    else if (type==="hourly"){
      if(!model){
         return alert("Please select a model first.");
      }
      else{
        await fetch("/api/hourly-report", {
      method: 'POST',
      body: JSON.stringify({
        model:hourlyReportModel
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      },
   }

        )
      }
    }
  };

useEffect(()=>{
if(formData.defect==="casting"){
  setSubDefects([...castingSubDefects])
}else if(formData.defect==="machining"){
  setSubDefects([...machiningSubDefects])
}
else{
  setSubDefects([])
}

if(Number(formData.modelState)===0 || Number(formData.modelState)===2){
setDefectsValid(true)
}
else{
  setDefectsValid(false)
  const updatedFormData={...formData}
  delete updatedFormData.defect;
  delete updatedFormData.subDefect;
  setFormData(updatedFormData);
}
},[formData.defect,formData.modelState])


  return (
    <>
     <div className="flex flex-col md:flex-row gap-8 p-6">
    <form onSubmit={(e)=>handleSubmit(e)} className='w-full md:w-2/3 p-6 bg-white rounded-xl shadow space-y-4'>
      <h1 className="text-xl font-semibold mb-2 text-center mx-auto">Add part data</h1>
      <div className="flex flex-col">
    <label for="model" className="block mb-1 font-medium text-gray-700">Model</label>
    <select
    id="model"
    onChange={(e)=>handleChange(e)}
    required
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" hidden>-- Select an option --</option>
      {models.map(model=><option value={model}>{model}</option>)}
    </select>
    </div>
    <div className="flex flex-col">
    <label for="modelState" className="block mb-1 font-medium text-gray-700">Model state</label>
    <select
    id="modelState"
    onChange={(e)=>handleChange(e)}
    required
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
       <option value="" hidden>-- Select an option --</option>
      {modelStates.map(modelState=><option value={modelState.value}>{modelState.type}</option>)}
    </select>
    </div>
    { defectsValid && <>
    <div className="flex flex-col">
    <label for="defect" className="block mb-1 font-medium text-gray-700">Defect Type</label>
    <select
    onChange={(e)=>handleChange(e)}
    id="defect"
    required
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
       <option value="" hidden>-- Select an option --</option>
       {defects.map(defect=><option value={defect}>{defect}</option>)}
    </select>
    </div>
    <div className="flex flex-col">
    <label for="subDefect" className="block mb-1 font-medium text-gray-700">Defect sub type</label>
    <select
    id="subDefect"
    onChange={(e)=>handleChange(e)}
    required
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
       <option value="" hidden>-- Select an option --</option>
      {subDefects?.map(subDefect=><option value={subDefect?.label}>{`${subDefect?.code} - ${subDefect?.label}`}</option>)}
    </select>
    </div>
    </>
}
    
  <div className="text-center mt-4">
    <button type="submit"   className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300">Add data</button>
    </div>
   </form>

    <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-semibold">Generate Reports</h2>

        {[
          { label: "Inspection Report", type: "inspection" },
          { label: "Pareto Report", type: "pareto" },
          { label: "Model Trend", type: "trend" }
        ].map((report) => (
          <button
            key={report.type}
             onClick={() => handleReport(report.type)}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {report.label}
          </button>
        ))}

         <div className="flex flex-col">
    <label htmlFor="reportModel" className="block mb-1 font-medium text-gray-700">
      Choose Model for Hourly Report
    </label>
    <select
      id="reportModel"
      value={hourlyReportModel}
      onChange={e => setHourlyReportModel(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option hidden value="">-- Select Model --</option>
      {models.map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  </div>

  {/* Hourly Report button now disabled until a model is picked */}
  <button
    onClick={() => handleReport("hourly", hourlyReportModel)}
    disabled={!hourlyReportModel}
    className={
      `w-full py-2 rounded transition ` +
      (!hourlyReportModel
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700 text-white')
    }
  >
    Hourly Report
  </button>
      </div>
       </div>
    </>
  )
}

export default App
