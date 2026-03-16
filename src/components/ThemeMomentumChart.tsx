"use client"

import {LineChart, Line, XAxis, YAxis, Tooltip} from "recharts"

export default function ThemeMomentumChart(){

  const data = [
    {day:"Mon",score:0.70},
    {day:"Tue",score:0.74},
    {day:"Wed",score:0.78},
    {day:"Thu",score:0.85},
    {day:"Fri",score:0.91},
  ]

  return(
    <div style={{marginTop:60}}>

      <h2>Theme Momentum Trend</h2>

      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="day"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey="score"/>
      </LineChart>

    </div>
  )
}