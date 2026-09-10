import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Bell, CalendarClock, ChevronDown, CircleCheck,
  Fuel, Gauge, IndianRupee, LayoutDashboard, Menu, MoreHorizontal,
  Navigation, Package, RefreshCw, Route, Settings, Truck, Users, Wrench,
  X, Zap
} from "lucide-react";
import "./styles.css";

const TOTAL = 10000;

const vehicles = [
  { id:"KA-01-MH-4821", driver:"Ravi Kumar", city:"Bengaluru", route:"Bengaluru → Chennai", status:"On Road", speed:54, km:286, fuel:8.6, eta:"18:40" },
  { id:"MH-12-QA-7410", driver:"Suresh Patil", city:"Pune", route:"Pune → Mumbai", status:"On Road", speed:61, km:138, fuel:8.1, eta:"16:25" },
  { id:"TN-38-AB-2098", driver:"Arun Raj", city:"Coimbatore", route:"Coimbatore → Bengaluru", status:"On Road", speed:48, km:192, fuel:9.0, eta:"19:10" },
  { id:"DL-01-RT-6254", driver:"Amit Yadav", city:"New Delhi", route:"Delhi → Jaipur", status:"On Road", speed:67, km:248, fuel:7.8, eta:"17:55" },
  { id:"GJ-05-KL-3817", driver:"Imran Sheikh", city:"Ahmedabad", route:"Ahmedabad → Surat", status:"Idle", speed:0, km:74, fuel:8.4, eta:"—" },
  { id:"TS-09-FG-9182", driver:"Prakash Rao", city:"Hyderabad", route:"Hyderabad → Vijayawada", status:"Maintenance", speed:0, km:121, fuel:7.6, eta:"—" }
];

const alerts = [
  { type:"warning", title:"Harsh braking detected", vehicle:"KA-01-MH-4821", time:"2 min ago" },
  { type:"danger", title:"Service due in 420 km", vehicle:"DL-01-RT-6254", time:"11 min ago" },
  { type:"info", title:"Trip completed", vehicle:"MH-12-QA-7410", time:"24 min ago" }
];

function Metric({ icon, label, value, note, tone="" }) {
  return (
    <div className="metricCard">
      <div className={`metricIcon ${tone}`}>{icon}</div>
      <div className="metricContent">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function App() {
  const [onRoad, setOnRoad] = useState(7482);
  const [drivers, setDrivers] = useState(6834);
  const [activeTrips, setActiveTrips] = useState(4126);
  const [fuel, setFuel] = useState(8.4);
  const [distance, setDistance] = useState(184260);
  const [updated, setUpdated] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnRoad(v => Math.max(6200, Math.min(8900, v + Math.floor(Math.random()*31)-15)));
      setDrivers(v => Math.min(8200, v + Math.floor(Math.random()*24)+3));
      setActiveTrips(v => Math.max(3000, v + Math.floor(Math.random()*19)-9));
      setFuel(Number((8.0 + Math.random() * .9).toFixed(1)));
      setDistance(v => v + Math.floor(Math.random()*70)+20);
      setUpdated(new Date());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const pct = ((onRoad / TOTAL) * 100).toFixed(1);
  const activePct = Math.round((onRoad / TOTAL) * 100);

  const statusCounts = useMemo(() => ({
    onRoad,
    idle: 1326,
    maintenance: 418,
    offline: TOTAL - onRoad - 1326 - 418
  }), [onRoad]);

  const time = updated.toLocaleTimeString("en-IN", {
    hour:"2-digit", minute:"2-digit", second:"2-digit"
  });

  return (
    <div className="shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sideBrand">
          <div className="brandMark">S</div>
          <div><b>Skyppy</b><span>Nexus</span></div>
          <button className="closeMenu" onClick={() => setMenuOpen(false)}><X size={18}/></button>
        </div>
        <nav>
          <div className="navLabel">WORKSPACE</div>
          <a className="active"><LayoutDashboard size={17}/> Dashboard</a>
          <a><Truck size={17}/> Fleet</a>
          <a><Navigation size={17}/> Trips</a>
          <a><Users size={17}/> Drivers</a>
          <a><Package size={17}/> Deliveries</a>
          <div className="navLabel">OPERATIONS</div>
          <a><Wrench size={17}/> Maintenance</a>
          <a><Fuel size={17}/> Fuel & Expenses</a>
          <a><AlertTriangle size={17}/> Alerts <em>12</em></a>
          <a><Settings size={17}/> Settings</a>
        </nav>
        <div className="sideBottom">
          <div className="indiaTag">INDIA OPERATIONS</div>
          <p>INR · IST · 24×7 Fleet</p>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="menuButton" onClick={() => setMenuOpen(true)}><Menu/></button>
          <div>
            <h1>Fleet Dashboard</h1>
            <p>India operations · All regions</p>
          </div>
          <div className="topActions">
            <div className="dateBox"><CalendarClock size={16}/> 10 Sep 2026</div>
            <button className="iconButton"><Bell size={18}/><i>3</i></button>
            <div className="profile">MK <span>Fleet Admin<small>Operations</small></span><ChevronDown size={15}/></div>
          </div>
        </header>

        <main className="content">
          <section className="heroRow">
            <div>
              <h2>Good afternoon,</h2>
              <p>Here’s your live fleet performance across India.</p>
            </div>
            <div className="livePill"><span/> Live data · {time}</div>
          </section>

          <section className="summaryGrid">
            <div className="card fleetCard">
              <div className="cardTop"><span>Total Vehicles</span><Truck size={18}/></div>
              <div className="bigNumber">10,000</div>
              <div className="progress"><span style={{width:`${activePct}%`}}/></div>
              <div className="footLine"><span>{activePct}% currently active</span><b>Static fleet</b></div>
            </div>
            <div className="card fleetCard blueCard">
              <div className="cardTop"><span>Vehicles on Road</span><Activity size={18}/></div>
              <div className="bigNumber">{onRoad.toLocaleString("en-IN")}</div>
              <div className="progress blueProgress"><span style={{width:`${activePct}%`}}/></div>
              <div className="footLine"><span>{pct}% of total fleet</span><b className="up">● Live</b></div>
            </div>
            <div className="card miniSummary">
              <span>Active Trips</span><strong>{activeTrips.toLocaleString("en-IN")}</strong><small><CircleCheck size={13}/> Trips in progress</small>
            </div>
            <div className="card miniSummary">
              <span>Fleet Efficiency</span><strong>{fuel.toFixed(1)} <small>km/L</small></strong><small className="up">↑ 3.2% vs yesterday</small>
            </div>
          </section>

          <section className="metricsGrid">
            <Metric icon={<Users/>} label="Drivers" value={drivers.toLocaleString("en-IN")} note="Active drivers" tone="blue"/>
            <Metric icon={<Gauge/>} label="Avg. Speed" value="52 km/h" note="Across active vehicles"/>
            <Metric icon={<Fuel/>} label="Fuel Efficiency" value={`${fuel.toFixed(1)} km/L`} note="Fleet average" tone="green"/>
            <Metric icon={<Route/>} label="Distance Today" value={`${distance.toLocaleString("en-IN")} km`} note="Across all vehicles"/>
            <Metric icon={<IndianRupee/>} label="Fuel Cost Today" value="₹12.84 L" note="Estimated spend" tone="orange"/>
            <Metric icon={<Zap/>} label="On-time Delivery" value="94.6%" note="Today's performance" tone="green"/>
          </section>

          <div className="twoCol">
            <section className="card tableCard">
              <div className="sectionHead">
                <div><h3>Vehicle Operations</h3><p>Live telematics from selected fleet</p></div>
                <button className="filter">All vehicles <ChevronDown size={14}/></button>
              </div>
              <div className="tableWrap">
                <table>
                  <thead><tr><th>Vehicle</th><th>Driver</th><th>Route</th><th>Status</th><th>Speed</th><th>Efficiency</th><th>ETA</th></tr></thead>
                  <tbody>
                    {vehicles.map(v => <tr key={v.id}>
                      <td><b>{v.id}</b><small>{v.city}</small></td>
                      <td>{v.driver}</td><td>{v.route}</td>
                      <td><span className={`status ${v.status.toLowerCase().replace(" ","-")}`}><i/>{v.status}</span></td>
                      <td>{v.speed ? `${v.speed} km/h` : "—"}</td>
                      <td>{v.fuel ? `${v.fuel} km/L` : "—"}</td><td>{v.eta}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card alertsCard">
              <div className="sectionHead"><div><h3>Fleet Alerts</h3><p>Requires attention</p></div><button className="more"><MoreHorizontal/></button></div>
              <div className="alertList">
                {alerts.map((a,i) => <div className="alert" key={i}>
                  <div className={`alertIcon ${a.type}`}><AlertTriangle size={15}/></div>
                  <div><b>{a.title}</b><span>{a.vehicle} · {a.time}</span></div>
                </div>)}
              </div>
              <button className="viewAll">View all 12 alerts</button>
            </section>
          </div>

          <section className="card regionalCard">
            <div className="sectionHead"><div><h3>Regional Fleet Snapshot</h3><p>Current vehicle distribution across major Indian operations</p></div><button className="refresh"><RefreshCw size={14}/> Auto refresh</button></div>
            <div className="regions">
              {[
                ["South India","Bengaluru · Chennai · Hyderabad",3840,79],
                ["West India","Mumbai · Pune · Ahmedabad",2710,74],
                ["North India","Delhi NCR · Jaipur · Lucknow",2120,71],
                ["East India","Kolkata · Bhubaneswar · Patna",1330,68]
              ].map(([name, places,count,rate]) => <div className="region" key={name}>
                <div className="regionHead"><b>{name}</b><strong>{count.toLocaleString("en-IN")}</strong></div>
                <span>{places}</span>
                <div className="regionBar"><i style={{width:`${rate}%`}}/></div>
                <small>{rate}% vehicles active</small>
              </div>)}
            </div>
          </section>

          <footer>Skyppy Nexus · Fleet Intelligence Platform · India · All figures shown in INR / IST</footer>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
