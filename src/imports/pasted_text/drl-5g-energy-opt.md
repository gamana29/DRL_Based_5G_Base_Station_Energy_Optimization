Create a fully interactive, modern engineering web application titled:

“Deep Reinforcement Learning-Based 5G Base Station Energy Optimization”

The website should visually simulate a real 5G cellular network and demonstrate how a Deep Reinforcement Learning (DRL) agent dynamically controls base stations to reduce energy consumption while maintaining user Quality of Service (QoS).

IMPORTANT:
This must NOT look like a simple business dashboard.
It should look like an actual 5G network simulation/control center where the network is visibly operating in real time.

TECHNOLOGY STYLE:

* Modern 5G/6G research laboratory interface
* Dark professional engineering theme
* Futuristic but realistic
* Clean technical UI
* Smooth animations
* Interactive network visualization
* Responsive desktop layout
* Avoid excessive decorative elements
* Prioritize visual demonstration of the algorithm

MAIN SCREEN:

Create a large interactive 2D cellular network map as the central element.

Display:

* 5–8 5G base stations distributed across the map
* Each base station represented by a tower icon
* Circular coverage areas around each base station
* Multiple mobile users distributed throughout the coverage area
* Animated signal/radio-wave effects from active base stations
* User devices represented by small mobile/device icons
* Connecting lines between users and serving base stations
* Different visual states for base stations:

  * ACTIVE
  * SLEEP
  * HIGH LOAD
  * LOW LOAD

Base stations should visibly change state during the simulation.

SIMULATION:

Add a prominent “START SIMULATION” button.

When clicked:

1. Start an animated 5G traffic simulation.
2. Users should move slowly around the network.
3. User traffic demand should continuously change.
4. Base station loads should change.
5. The DRL agent should evaluate the network state.
6. The DRL agent should decide whether each base station should remain active or enter sleep mode.
7. Base stations should visibly switch between ACTIVE and SLEEP states.
8. Coverage areas should update.
9. Users should automatically associate with suitable active base stations.
10. Energy consumption should update continuously.
11. QoS indicators should update.
12. Energy savings should be calculated and displayed.

Make the simulation visually obvious. The user should be able to WATCH the DRL algorithm making decisions.

DRL PIPELINE:

Create a visible side panel called:

“DRL DECISION ENGINE”

Show the following pipeline:

Network State
↓
State Representation
↓
DRL Agent
↓
Action Selection
↓
Base Station Control
↓
Network Reward

Display example state variables:

* Number of active BSs
* User density
* Traffic load
* Average SINR
* Average throughput
* Energy consumption
* QoS violation rate

Actions:

* Keep BS Active
* Put BS into Sleep
* Wake BS
* Adjust Transmission Power

Reward function visualization:

Reward =
QoS Satisfaction
− Energy Consumption
− Coverage Penalty

Show the current reward dynamically.

NETWORK MAP INTERACTION:

Allow the user to click any base station.

When clicked, open a detailed information panel showing:

Base Station ID
Operating State
Transmission Power
Current Load
Connected Users
Energy Consumption
Coverage Radius
Average SINR
Throughput
DRL Action
Current Reward

Include a small live chart for that base station.

USER INTERACTION:

Allow clicking individual users.

Show:

* User ID
* Position
* Connected BS
* Traffic demand
* SINR
* Data rate
* QoS status

Use animated connections between users and their serving base stations.

CONTROL PANEL:

Create controls for:

Traffic Load:
[Low] [Medium] [High]

Number of Users:
slider from 10–100

Simulation Speed:
[0.5x] [1x] [2x] [5x]

DRL Mode:
[ON/OFF]

Optimization Objective:
[Energy Saving]
[QoS Priority]
[Balanced]

Add:
RESET SIMULATION

PERFORMANCE PANEL:

Create live performance cards:

ACTIVE BASE STATIONS
Example: 5 / 8

TOTAL ENERGY
Example: 42.8 kW

ENERGY SAVINGS
Example: 27.4%

AVERAGE THROUGHPUT
Example: 185 Mbps

AVERAGE SINR
Example: 18.6 dB

QoS SATISFACTION
Example: 96.2%

DRL REWARD
Example: +84.7

These values must visually change during simulation.

LIVE CHARTS:

Add animated charts:

1. Energy Consumption vs Time
2. Active Base Stations vs Time
3. Average Throughput vs Time
4. QoS Satisfaction vs Time
5. DRL Reward vs Time
6. Traffic Load vs Time

Use smooth real-time chart animations.

COMPARISON SECTION:

Create a section titled:

“Conventional vs DRL Optimization”

Show two network states side-by-side.

CONVENTIONAL MODE:

* All base stations active
* Higher energy consumption
* More unnecessary active capacity

DRL MODE:

* Dynamically activated/sleeping base stations
* Lower energy consumption
* Maintained QoS
* Intelligent resource management

Display comparison metrics:

Energy Consumption
Active BS Count
Energy Savings
Average Throughput
QoS Satisfaction

Include an animated transition when switching between Conventional and DRL modes.

NETWORK EVENT LOG:

Add a real-time event console:

[20:41:02] BS-03 → SLEEP
[20:41:03] Traffic detected in Zone 4
[20:41:04] BS-03 → WAKE
[20:41:05] User U27 connected to BS-03
[20:41:06] DRL Agent → ACTION: REDUCE POWER
[20:41:07] Energy saving increased to 28.1%

Events should appear dynamically while the simulation runs.

ARCHITECTURE PAGE:

Create a separate “SYSTEM ARCHITECTURE” page.

Show this architecture visually:

5G Users
↓
Traffic Generator
↓
5G Base Stations
↓
Network Environment
↓
State Observation
↓
DRL Agent
↓
Action
↓
BS ON/OFF + Power Control
↓
Network Response
↓
Reward
↓
DRL Training

Include clear arrows and animated data flow.

DRL ALGORITHM PAGE:

Create a separate “DRL MODEL” page.

Show:

State:
S = {user density, traffic load, SINR, BS load, energy}

Action:
A = {ON, SLEEP, WAKE, POWER CONTROL}

Reward:
R = QoS − Energy Cost − Penalty

Show an animated DRL loop:

STATE → AGENT → ACTION → ENVIRONMENT → REWARD → STATE

Include a simple neural-network visualization with input nodes, hidden layers and output action nodes.

RESULTS PAGE:

Create a “RESULTS & ANALYSIS” page.

Show:

* Energy consumption reduction
* Percentage energy savings
* QoS preservation
* Number of sleeping BSs
* Throughput
* SINR

Include interactive graphs and a final performance summary.

Add a clear statement:

“Objective: Minimize 5G network energy consumption while maintaining QoS.”

VISUAL SIMULATION DETAILS:

Make the network map the main visual focus.

Use:

* Animated radio waves
* Moving users
* Animated connection lines
* Pulsing active base stations
* Fading/inactive sleeping base stations
* Dynamic coverage circles
* Live metric updates
* Smooth transitions
* Real-time event messages
* Simulation timer

The website should feel like a real 5G network is operating.

NAVIGATION:

Create a top navigation bar:

NETWORK SIMULATION
DRL ENGINE
ARCHITECTURE
MODEL
RESULTS

Add a small status indicator:

● SYSTEM ONLINE

Add:
Simulation Time: 00:00
Environment: 5G RAN
Agent: DRL
Optimization: ENERGY

DESIGN:

Use a professional dark interface suitable for a university final-year engineering project and research demonstration.

The final website should look impressive when shown to:

* professors
* recruiters
* interviewers
* researchers

Most importantly, prioritize the VISUAL SIMULATION over ordinary dashboard cards.

The user should immediately understand:

“Base stations consume energy → traffic changes → DRL observes the network → DRL makes decisions → unnecessary base stations sleep → energy consumption decreases → QoS remains acceptable.”

Make the entire experience interactive and visually demonstrable rather than static.
