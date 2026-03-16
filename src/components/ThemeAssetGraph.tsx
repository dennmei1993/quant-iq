"use client"

import ReactFlow from "reactflow"

export default function ThemeAssetGraph() {

  const nodes = [
    { id:"theme", position:{x:250,y:0}, data:{label:"AI Theme"}, type:"input" },

    { id:"nvda", position:{x:100,y:150}, data:{label:"NVDA"} },
    { id:"msft", position:{x:250,y:150}, data:{label:"MSFT"} },
    { id:"tsm", position:{x:400,y:150}, data:{label:"TSM"} }
  ]

  const edges = [
    { id:"e1", source:"theme", target:"nvda" },
    { id:"e2", source:"theme", target:"msft" },
    { id:"e3", source:"theme", target:"tsm" }
  ]

  return (
    <div style={{height:400, marginTop:40}}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  )
}