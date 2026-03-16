"use client"

import {LineChart, Line, XAxis, YAxis, Tooltip} from "recharts"

export default function ThemeTrendChart(){

  const data = [
    {day:"Mon",score:0.60},
    {day:"Tue",score:0.67},
    {day:"Wed",score:0.72},
    {day:"Thu",score:0.82},
    {day:"Fri",score:0.91}
  ]

  return(
    <div style={{marginTop:50}}>

      <h2>Momentum Trend</h2>

      <LineChart width={700} height={300} data={data}>
        <XAxis dataKey="day"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey="score"/>
      </LineChart>

    </div>
  )
}