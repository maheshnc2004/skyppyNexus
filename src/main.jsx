import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Bell, CalendarClock, ChevronDown, CircleCheck,
  Fuel, Gauge, IndianRupee, LayoutDashboard, Menu, MoreHorizontal,
  Navigation, Package, RefreshCw, Route, Search, Settings, Truck, Users, Wrench,
  X, Zap
} from "lucide-react";
import "./styles.css";

const TOTAL = 10203;

const vehicles = [
  { id:"KA-01-MH-4821", driver:"Ravi Kumar", city:"Bengaluru", route:"Bengaluru → Chennai", status:"On Road", speed:54, km:286, fuel:8.6, eta:"18:40" },
  { id:"MH-12-QA-7410", driver:"Suresh Patil", city:"Pune", route:"Pune → Mumbai", status:"On Road", speed:61, km:138, fuel:8.1, eta:"16:25" },
  { id:"TN-38-AB-2098", driver:"Arun Raj", city:"Coimbatore", route:"Coimbatore → Bengaluru", status:"On Road", speed:48, km:192, fuel:9.0, eta:"19:10" },
  { id:"DL-01-RT-6254", driver:"Amit Yadav", city:"New Delhi", route:"Delhi → Jaipur", status:"On Road", speed:67, km:248, fuel:7.8, eta:"17:55" },
  { id:"GJ-05-KL-3817", driver:"Imran Sheikh", city:"Ahmedabad", route:"Ahmedabad → Surat", status:"Idle", speed:0, km:74, fuel:8.4, eta:"—" },
  { id:"TS-09-FG-9182", driver:"Prakash Rao", city:"Hyderabad", route:"Hyderabad → Vijayawada", status:"Maintenance", speed:0, km:121, fuel:7.6, eta:"—" },
  { id:"AP-29-XY-1123", driver:"Naveen Reddy", city:"Visakhapatnam", route:"Vizag → Vijayawada", status:"On Road", speed:58, km:336, fuel:8.7, eta:"20:05" },
  { id:"RJ-14-PL-2958", driver:"Rajesh Meena", city:"Jaipur", route:"Jaipur → Ahmedabad", status:"On Road", speed:63, km:410, fuel:8.2, eta:"21:15" },
  { id:"WB-23-CD-8041", driver:"Suman Das", city:"Kolkata", route:"Kolkata → Patna", status:"Idle", speed:0, km:92, fuel:8.5, eta:"—" },
  { id:"KL-07-LM-3271", driver:"Arshad Ali", city:"Kochi", route:"Kochi → Bengaluru", status:"On Road", speed:50, km:175, fuel:9.1, eta:"17:42" },
  { id:"MH-22-TR-6184", driver:"Vikram More", city:"Nagpur", route:"Nagpur → Nashik", status:"On Road", speed:57, km:264, fuel:8.3, eta:"18:20" },
  { id:"UP-56-KS-9150", driver:"Hariom Singh", city:"Lucknow", route:"Lucknow → Kanpur", status:"Maintenance", speed:0, km:111, fuel:7.9, eta:"—" },
  { id:"TN-11-HJ-4472", driver:"Bharath Iyer", city:"Madurai", route:"Madurai → Chennai", status:"On Road", speed:52, km:302, fuel:8.8, eta:"19:35" },
  { id:"GJ-18-QR-6619", driver:"Kamal Patel", city:"Surat", route:"Surat → Mumbai", status:"On Road", speed:64, km:228, fuel:8.0, eta:"16:50" },
  { id:"PB-08-ZA-1149", driver:"Baljeet Singh", city:"Chandigarh", route:"Chandigarh → Delhi", status:"Idle", speed:0, km:81, fuel:8.6, eta:"—" }
];

const alerts = [
  { type:"warning", title:"Harsh braking detected", vehicle:"KA-01-MH-4821", time:"2 min ago" },
  { type:"danger", title:"Service due in 420 km", vehicle:"DL-01-RT-6254", time:"11 min ago" },
  { type:"info", title:"Trip completed", vehicle:"MH-12-QA-7410", time:"24 min ago" },
  { type:"warning", title:"Route delay reported", vehicle:"RJ-14-PL-2958", time:"31 min ago" }
];

const pageDetails = {
  "Dashboard": { title:"Operations Overview", subtitle:"Live fleet conditions across all regions" },
  "Fleet": { title:"Fleet Network", subtitle:"Regional fleet health and utilization" },
  "Trips": { title:"Trip Monitoring", subtitle:"Active routes, delays and trip performance" },
  "Drivers": { title:"Driver Management", subtitle:"Assignments, availability and productivity" },
  "Deliveries": { title:"Delivery Pipeline", subtitle:"Current dispatch and completion watchlist" },
  "Maintenance": { title:"Maintenance Center", subtitle:"Service schedules and critical inspections" },
  "Fuel & Expenses": { title:"Fuel & Cost Control", subtitle:"Efficiency and budget trends across operations" },
  "Alerts": { title:"Alert Console", subtitle:"Critical operations and route notifications" },
  "Settings": { title:"System Settings", subtitle:"Controls, permissions and delivery preferences" }
};

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
  const [drivers, setDrivers] = useState(7482);
  const [activeTrips, setActiveTrips] = useState(4126);
  const [fuel, setFuel] = useState(2.4);
  const [distance, setDistance] = useState(184260);
  const [updated, setUpdated] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Fleet");
  const [vehicleFilter, setVehicleFilter] = useState("All vehicles");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Fleet", icon: Truck },
    { label: "Trips", icon: Navigation },
    { label: "Drivers", icon: Users },
    { label: "Deliveries", icon: Package },
    { label: "Maintenance", icon: Wrench },
    { label: "Fuel & Expenses", icon: Fuel },
    { label: "Alerts", icon: AlertTriangle, count: 12 },
    { label: "Settings", icon: Settings }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setOnRoad(v => {
        const next = Math.max(6200, Math.min(8900, v + Math.floor(Math.random()*31)-15));
        setDrivers(next);
        return next;
      });
      setActiveTrips(v => Math.max(3000, v + Math.floor(Math.random()*19)-9));
      setFuel(Number((2.3 + Math.random() * 0.1).toFixed(1)));
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

  const filteredVehicles = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return vehicles.filter(vehicle => {
      const matchesFilter = vehicleFilter === "All vehicles" || vehicle.status === vehicleFilter;
      const matchesSearch = [vehicle.id, vehicle.driver, vehicle.city, vehicle.route].join(" ").toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, vehicleFilter]);

  const visibleAlerts = showAllAlerts ? alerts : alerts.slice(0, 3);

  const time = updated.toLocaleTimeString("en-IN", {
    hour:"2-digit", minute:"2-digit", second:"2-digit"
  });
  const hour = updated.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleRefresh = () => {
    setOnRoad(v => {
      const next = Math.max(6200, Math.min(8900, v + Math.floor(Math.random()*31)-15));
      setDrivers(next);
      return next;
    });
    setActiveTrips(v => Math.max(3000, v + Math.floor(Math.random()*19)-9));
    setFuel(Number((8.0 + Math.random() * .9).toFixed(1)));
    setDistance(v => v + Math.floor(Math.random()*70)+20);
    setUpdated(new Date());
  };

  const cycleVehicleFilter = () => {
    const filters = ["All vehicles", "On Road", "Idle", "Maintenance"];
    const currentIndex = filters.indexOf(vehicleFilter);
    setVehicleFilter(filters[(currentIndex + 1) % filters.length]);
  };

  const renderPageContent = () => {
    const pageInfo = pageDetails[activeNav] || pageDetails["Dashboard"];

    if (activeNav === "Dashboard") {
      return (
        <>
          <section className="summaryGrid">
            <div className="card fleetCard">
              <div className="cardTop"><span>Total Vehicles</span><Truck size={18}/></div>
              <div className="bigNumber">12414+</div>
              <div className="progress"><span style={{width:`${activePct}%`}}/></div>
              <div className="footLine"><span>{activePct}% currently active</span><b></b></div>
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
              <span>Fuel Efficiency</span><strong>{fuel.toFixed(1)} <small>km/L</small></strong><small className="up">↑ 3.2% vs yesterday</small>
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
                <div className="headerControls">
                  <label className="searchInput">
                    <Search size={14}/>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search vehicle"
                    />
                  </label>
                  <button className="filter" type="button" onClick={cycleVehicleFilter}>{vehicleFilter} <ChevronDown size={14}/></button>
                </div>
              </div>
              <div className="tableWrap">
                <table>
                  <thead><tr><th>Vehicle</th><th>Driver</th><th>Route</th><th>Status</th><th>Speed</th><th>Efficiency</th><th>ETA</th></tr></thead>
                  <tbody>
                    {filteredVehicles.length ? filteredVehicles.map(v => <tr key={v.id}>
                      <td><b>{v.id}</b><small>{v.city}</small></td>
                      <td>{v.driver}</td><td>{v.route}</td>
                      <td><span className={`status ${v.status.toLowerCase().replace(" ","-")}`}><i/>{v.status}</span></td>
                      <td>{v.speed ? `${v.speed} km/h` : "—"}</td>
                      <td>{v.fuel ? `${v.fuel} km/L` : "—"}</td><td>{v.eta}</td>
                    </tr>) : (
                      <tr>
                        <td colSpan="7" className="emptyRow">No vehicles match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card alertsCard">
              <div className="sectionHead"><div><h3>Fleet Alerts</h3><p>Requires attention</p></div><button className="more" type="button" onClick={() => setShowAllAlerts(value => !value)}><MoreHorizontal/></button></div>
              <div className="alertList">
                {visibleAlerts.map((a,i) => <div className="alert" key={i}>
                  <div className={`alertIcon ${a.type}`}><AlertTriangle size={15}/></div>
                  <div><b>{a.title}</b><span>{a.vehicle} · {a.time}</span></div>
                </div>)}
              </div>
              <button className="viewAll" type="button" onClick={() => setShowAllAlerts(value => !value)}>{showAllAlerts ? "Hide alerts" : `View all ${alerts.length} alerts`}</button>
            </section>
          </div>

          <section className="card regionalCard">
            <div className="sectionHead"><div><h3>Regional Fleet Snapshot</h3><p>Current vehicle distribution across major Indian operations</p></div><button className="refresh" type="button" onClick={handleRefresh}><RefreshCw size={14}/> Auto refresh</button></div>
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
        </>
      );
    }

    return (
      <section className="pagePanel">
        <div className="pageHeader">
          <div>
            <p className="eyebrow">{pageInfo.title}</p>
            <h2>{pageInfo.subtitle}</h2>
          </div>
          <button className="refresh" type="button" onClick={handleRefresh}><RefreshCw size={14}/> Sync now</button>
        </div>

        <div className="detailGrid">
          <div className="detailCard">
            <span className="detailLabel">Live status</span>
            <strong>{onRoad.toLocaleString("en-IN")}</strong>
            <small>active vehicles in motion</small>
          </div>
          <div className="detailCard">
            <span className="detailLabel">Drivers</span>
            <strong>{drivers.toLocaleString("en-IN")}</strong>
            <small>assigned and available</small>
          </div>
          <div className="detailCard">
            <span className="detailLabel">Trips</span>
            <strong>{activeTrips.toLocaleString("en-IN")}</strong>
            <small>currently en route</small>
          </div>
          <div className="detailCard">
            <span className="detailLabel">Efficiency</span>
            <strong>{fuel.toFixed(1)} km/L</strong>
            <small>fleet average this shift</small>
          </div>
        </div>

        <div className="detailList">
          {activeNav === "Fleet" && vehicles.slice(0, 8).map(v => (
            <div className="detailRow" key={v.id}>
              <div><b>{v.id}</b><span>{v.driver}</span></div>
              <div>{v.city}</div>
              <div>{v.route}</div>
              <div><span className={`status ${v.status.toLowerCase().replace(" ","-")}`}><i/>{v.status}</span></div>
            </div>
          ))}

          {activeNav === "Trips" && [
            ["Bengaluru → Chennai", "Delayed by 12 min", "2,860 km", "93% on time"],
            ["Pune → Mumbai", "On schedule", "1,380 km", "96% on time"],
            ["Jaipur → Ahmedabad", "Weather alert", "2,450 km", "88% on time"],
            ["Kochi → Bengaluru", "On schedule", "1,720 km", "94% on time"]
          ].map(([route, status, distance, score], idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{route}</b><span>Route ID {idx + 101}</span></div>
              <div>{status}</div>
              <div>{distance}</div>
              <div>{score}</div>
            </div>
          ))}

          {activeNav === "Drivers" && vehicles.slice(0, 8).map((v, idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{v.driver}</b><span>{v.id}</span></div>
              <div>{v.city}</div>
              <div>{v.status}</div>
              <div>{v.speed ? `${v.speed} km/h` : "Off duty"}</div>
            </div>
          ))}

          {activeNav === "Deliveries" && [
            ["Outbound loads", "134", "28 dispatched today"],
            ["Inbound loads", "87", "21 in transit"],
            ["Warehouse scan", "96%", "Pickup accuracy"],
            ["Returns", "18", "4 flagged for review"]
          ].map(([name, value, note], idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{name}</b><span>{note}</span></div>
              <div>{value}</div>
              <div>Live</div>
              <div>Ready</div>
            </div>
          ))}

          {activeNav === "Maintenance" && [
            ["Brake check", "KA-01-MH-4821", "Due in 2 hrs"],
            ["Oil filter", "DL-01-RT-6254", "Due today"],
            ["Tire scan", "UP-56-KS-9150", "Inspection pending"],
            ["Battery test", "TS-09-FG-9182", "Service lane"]
          ].map(([task, vehicle, status], idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{task}</b><span>{vehicle}</span></div>
              <div>{status}</div>
              <div>Priority</div>
              <div>{idx % 2 === 0 ? "Open" : "Monitoring"}</div>
            </div>
          ))}

          {activeNav === "Fuel & Expenses" && [
            ["Diesel used", "15,480 L", "₹9.4 L"],
            ["Avg cost per trip", "₹2,140", "-3.6% vs last week"],
            ["Telematics battery", "₹54,200", "Updated yesterday"],
            ["Route overhead", "₹1.86 L", "Stable"]
          ].map(([name, value, note], idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{name}</b><span>{note}</span></div>
              <div>{value}</div>
              <div>Budget</div>
              <div>{idx % 2 === 0 ? "Healthy" : "Watch"}</div>
            </div>
          ))}

          {activeNav === "Alerts" && visibleAlerts.map((alert, idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{alert.title}</b><span>{alert.vehicle}</span></div>
              <div>{alert.time}</div>
              <div>{alert.type}</div>
              <div>Action</div>
            </div>
          ))}

          {activeNav === "Settings" && [
            ["Fleet rules", "Enabled", "Auto alerts on"],
            ["Driver compliance", "Synced", "Night shift mode"],
            ["Maintenance policy", "Active", "Inspection SLA 72h"],
            ["Vehicle assignments", "Auto", "Route balancing enabled"]
          ].map(([name, value, note], idx) => (
            <div className="detailRow" key={idx}>
              <div><b>{name}</b><span>{note}</span></div>
              <div>{value}</div>
              <div>System</div>
              <div>Saved</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="browserShell">
      <div className="browserBar">
        <div className="windowControls">
          <span className="winDot red"/>
          <span className="winDot yellow"/>
          <span className="winDot green"/>
        </div>
        <div className="browserTabs">
          <div className="browserTab active">Skyppy Nexus — Fleet Intel</div>
          <div className="browserTab">Site not found</div>
          <div className="browserTab">Team protection | Notify</div>
        </div>
        <div className="toolbarActions">
          <span className="toolbarIcon">⌕</span>
          <span className="toolbarIcon">◔</span>
          <span className="toolbarIcon">⋯</span>
        </div>
      </div>

      <div className="shell">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <div className="sideBrand">
            <div className="brandMark">S</div>
            <div><b>Skyppy</b><span>Nexus</span></div>
            <button className="closeMenu" onClick={() => setMenuOpen(false)}><X size={18}/></button>
          </div>
          <nav>
            <div className="navLabel">WORKSPACE</div>
            {navItems.map(({ label, icon: Icon, count }) => (
              <button
                type="button"
                key={label}
                className={`navItem ${activeNav === label ? "active" : ""}`}
                onClick={() => setActiveNav(label)}
              >
                <Icon size={17}/> {label}
                {count ? <em>{count}</em> : null}
              </button>
            ))}
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
              <div className="dateBox"><CalendarClock size={16}/> {updated.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
              <button className="iconButton" type="button" onClick={() => setShowAllAlerts(true)}><Bell size={18}/><i>3</i></button>
              <div className="profile">MK <span>Fleet Admin<small>Operations</small></span><ChevronDown size={15}/></div>
            </div>
          </header>

          <main className="content">
            <section className="heroRow">
              <div>
                <h2>{greeting},</h2>
                <p>Here’s your live fleet performance across India.</p>
              </div>
              <div className="livePill"><span/> Live data · {time}</div>
            </section>

            {renderPageContent()}

            {activeNav === "Dashboard" && (
              <footer>Skyppy Nexus · Fleet Intelligence Platform · India · All figures shown in INR / IST</footer>
            )}
            {activeNav !== "Dashboard" && (
              <footer className="pageFooter">Skyppy Nexus · {activeNav} module · Last synced {time}</footer>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
