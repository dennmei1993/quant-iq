import DashboardHeader from "@/components/DashboardHeader"
import Panel from "@/components/Panel"

export default function Dashboard() {
  return (
    <div>

      <DashboardHeader />

      <div className="p-6 grid grid-cols-3 gap-6">

        <Panel title="Theme Momentum">
          AI ↑  
          Defense ↑  
          Obesity →
        </Panel>

        <Panel title="Macro Signals">
          CPI surprise  
          Oil supply risk  
          China stimulus
        </Panel>

        <Panel title="Top Assets">
          NVDA  
          MSFT  
          LLY
        </Panel>

      </div>

    </div>
  )
}