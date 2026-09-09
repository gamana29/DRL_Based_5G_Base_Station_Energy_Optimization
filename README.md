#  5G Base Station Energy Optimization using Deep Reinforcement Learning

An interactive 5G network simulation platform that demonstrates how **Deep Reinforcement Learning (DRL)** can intelligently manage base stations according to changing network traffic, reducing energy consumption while maintaining network coverage and Quality of Service (QoS).

The project combines **5G wireless networking, reinforcement learning, interactive visualization, UI/UX design, and web development** into a single educational simulator.

---

##  Project Overview

Modern 5G networks may contain multiple base stations operating simultaneously. During periods of low traffic, keeping every base station fully active can result in unnecessary energy consumption.

This project explores an intelligent **Base Station Energy Optimization** approach where a DRL agent learns to dynamically decide whether base stations should remain **ACTIVE** or transition into **SLEEP** mode based on the current network conditions.

Instead of presenting the model as a conventional ML dashboard, the project provides an **interactive visual simulator** where users can observe:

* Mobile users moving through the network
* Base station coverage areas
* Traffic variations
* Base station load
* Active/Sleep transitions
* DRL state and actions
* Energy consumption
* Network performance
* Reward changes

### Core Idea

```text
Traffic Changes
      ↓
Network Conditions Change
      ↓
DRL Agent Observes State
      ↓
Agent Selects Action
      ↓
Base Stations Change State
      ↓
Users Are Served
      ↓
Energy + QoS Are Updated
      ↓
Agent Receives Reward
      ↓
Learning Continues
```

---

#  Objectives

The main objectives of this project are:

* Reduce unnecessary 5G base station energy consumption.
* Dynamically adapt base station activity to network traffic.
* Maintain sufficient user coverage.
* Maintain acceptable throughput and QoS.
* Model the problem as a Reinforcement Learning environment.
* Visualize the DRL decision-making process.
* Compare DRL-based optimization with a conventional baseline.
* Provide an educational visualization of 5G energy management.

---

#  Reinforcement Learning Model

The base station energy optimization problem is formulated as a **Reinforcement Learning** problem.

The DRL agent observes the current network state, selects an action, receives a reward, and learns a policy that improves energy efficiency while maintaining network performance.

## State

The state can contain parameters such as:

```text
State =
[
    Traffic Load,
    Number of Users,
    PRB Utilization,
    Average SINR,
    Base Station Power,
    Neighboring Base Station Status
]
```

These parameters describe the current condition of the network.

---

## Action

The agent controls the operating state of the base stations.

For example, for four base stations:

```text
[1, 1, 0, 0]
```

where:

```text
1 → Base Station ACTIVE
0 → Base Station SLEEP
```

The action determines which base stations should remain active according to the current network demand.

---

#  Reward Function

The reward function balances energy efficiency and network performance.

A simplified formulation is:

```text
Reward =
α × Energy Saved
− β × Throughput Loss
− γ × Coverage Violation
− δ × Switching Cost
```

Where:

* **Energy Saved** → encourages low energy consumption.
* **Throughput Loss** → penalizes degradation in network throughput.
* **Coverage Violation** → penalizes users losing adequate coverage.
* **Switching Cost** → prevents excessive ON/OFF switching.
* **α, β, γ, δ** → weighting parameters.

The objective is to maximize the long-term cumulative reward.

---

#  Interactive 5G Network

The simulator represents a simplified 5G cellular network containing:

* Multiple base stations
* Mobile users
* Coverage regions
* Traffic demand
* Network load
* Base station operating states

Example:

```text
                    📡 BS1
                 /           \
              👤 👤          👤
                \             /
                 \           /
                  📡 BS2

             👤 → → → → 👤

                  📡 BS3
                    |
                   👤

                  📡 BS4
```

Users can move through the simulated network while base stations respond to changing traffic conditions.

---

#  Base Station States

Each base station can operate in different states.

| State       | Meaning                                                        |
| ----------- | -------------------------------------------------------------- |
| 🟢 ACTIVE   | Base station is fully operational                              |
| ⚫ SLEEP     | Base station is placed into a low-power state                  |
| 🟡 WAKING   | Base station is transitioning back to active mode              |
| 🔴 OVERLOAD | Base station is experiencing high traffic/resource utilization |

The state transitions are represented visually in the simulator.

---

#  Interactive Controls

The simulator allows users to experiment with different network conditions.

## Traffic Control

```text
LOW ───────────────────── HIGH
```

Increasing traffic causes additional network demand.

For example:

```text
Traffic ↑
   ↓
Number of Users ↑
   ↓
PRB Utilization ↑
   ↓
Base Station Load ↑
   ↓
DRL Agent Evaluates State
   ↓
Additional BS Activated
```

When traffic decreases:

```text
Traffic ↓
   ↓
Network Load ↓
   ↓
Redundant BS Detected
   ↓
DRL Agent Evaluates State
   ↓
BS Enters SLEEP Mode
   ↓
Energy Consumption ↓
```

---

#  DRL Decision Explanation

One of the important goals of this project is to make the DRL process understandable rather than treating the model as a black box.

For example:

```text
WHY DID THE AGENT DO THIS?

Traffic Load:       31%
BS3 Utilization:    12%
Neighbor BS Load:   48%
Coverage:           97%

Decision:
BS3 is lightly utilized and neighboring
base stations can serve the current demand.

→ BS3 switched to SLEEP
→ Energy consumption reduced
→ Coverage maintained
```

This allows users to understand the relationship between:

**Network State → Action → Reward**

---

#  Network Metrics

The simulator can monitor:

| Metric               | Description                             |
| -------------------- | --------------------------------------- |
| ⚡ Energy Consumption | Total simulated energy usage            |
| 📶 Throughput        | Data successfully served by the network |
| 👥 Users             | Number of connected users               |
| 📡 Active BS         | Number of active base stations          |
| 📍 Coverage          | Percentage of users adequately covered  |
| 📈 PRB Utilization   | Radio resource utilization              |
| 📡 SINR              | Signal-to-interference-plus-noise ratio |
| 🧠 Reward            | DRL agent's current reward              |

---

#  System Architecture

```text
                   ┌─────────────────────┐
                   │     USER INPUT      │
                   │ Traffic / Mobility  │
                   └──────────┬──────────┘
                              ↓
                   ┌─────────────────────┐
                   │   5G NETWORK MODEL  │
                   │ Users + BS + Load   │
                   └──────────┬──────────┘
                              ↓
                   ┌─────────────────────┐
                   │   NETWORK STATE     │
                   │ SINR / PRB / Users  │
                   └──────────┬──────────┘
                              ↓
                   ┌─────────────────────┐
                   │      DRL AGENT      │
                   │      DQN / PPO      │
                   └──────────┬──────────┘
                              ↓
                   ┌─────────────────────┐
                   │       ACTION        │
                   │ BS ON / BS SLEEP    │
                   └──────────┬──────────┘
                              ↓
                   ┌─────────────────────┐
                   │   NETWORK UPDATE    │
                   └──────────┬──────────┘
                              ↓
             ┌────────────────┴────────────────┐
             ↓                                 ↓
     ┌────────────────┐               ┌────────────────┐
     │ Energy Metrics │               │   QoS Metrics  │
     └────────────────┘               └────────────────┘
             │                                 │
             └────────────────┬────────────────┘
                              ↓
                   ┌─────────────────────┐
                   │  INTERACTIVE UI    │
                   │ Visualization +    │
                   │ Explanation        │
                   └─────────────────────┘
```

---

#  Design & Development Workflow

The project follows a complete **Design → Development → Version Control → Deployment** workflow.

```text
                    🎨 FIGMA
                       │
                       │ UI/UX Design
                       ↓
                💻 FRONTEND CODE
                 React + Vite
                       │
                       ↓
                   🐙 GITHUB
              Source Code + Git
                       │
                       ↓
                  🚀 NETLIFY
                   Deployment
                       │
                       ↓
                  🌐 LIVE DEMO
```

##  Figma

The interface was designed using **Figma** to plan the visual layout, components, controls, network visualization, and overall user experience before implementation.



---


#  Netlify

The interactive frontend is deployed using **Netlify**, allowing the project to be accessed through a live web application.

**Live Demo:**
[Open Live Website](https://drlbased5gbasestationenergyopti.netlify.app/)

---

#  Technology Stack

## Design

* Figma

##  Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* SVG
* CSS Animations
* Framer Motion

##  Machine Learning / DRL

* Python
* PyTorch
* Gymnasium
* Stable-Baselines3
* Deep Q-Network (DQN)
* Reinforcement Learning

## 🔗 Backend

* FastAPI
* WebSocket

##  Version Control

* Git
* GitHub

##  Deployment

* Netlify

---

#  Project Structure

```text
5g-energy-drl/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── BaseStation.jsx
│   │   │   ├── User.jsx
│   │   │   ├── NetworkMap.jsx
│   │   │   ├── TrafficControl.jsx
│   │   │   ├── DRLPanel.jsx
│   │   │   ├── Metrics.jsx
│   │   │   └── Explanation.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Simulator.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── environment.py
│   ├── network.py
│   ├── reward.py
│   ├── train.py
│   ├── inference.py
│   └── api.py
│
├── models/
│   └── dqn_model.zip
│
├── README.md
└── .gitignore
```

---

#  Development Methodology

The project is developed progressively to ensure that the underlying 5G concepts are understood before introducing the DRL model.

## Phase 1 — Network Visualization

Build the visual network containing:

* Base stations
* Coverage areas
* Mobile users
* User movement
* Traffic generation

---

## Phase 2 — Network Simulation

Implement:

* User association
* Traffic load
* PRB utilization
* SINR estimation
* Base station capacity
* Energy consumption

---

## Phase 3 — Baseline Controller

Before implementing DRL, a conventional rule-based controller can be used as a baseline.

Example:

```text
IF network traffic is low
    ↓
Sleep unnecessary BS

IF network traffic is high
    ↓
Activate additional BS
```

This provides a reference against which the DRL strategy can be evaluated.

---

## Phase 4 — DRL Environment

The network is converted into a Reinforcement Learning environment.

Core environment operations include:

```python
reset()
step(action)
state()
reward()
```

The environment provides the current network state to the agent and returns the resulting reward after each action.

---

## Phase 5 — DRL Training

A DQN agent can be trained to learn an energy-efficient base station control policy.

```text
Network State
      ↓
DRL Agent
      ↓
Action
      ↓
Base Station Configuration
      ↓
Network Simulation
      ↓
Reward
      ↓
Learning
```

---

## Phase 6 — Interactive Integration

The trained DRL model is connected to the visual simulator.

```text
React Frontend
      ↕
WebSocket / API
      ↕
Python Backend
      ↕
DRL Model
      ↕
5G Network Environment
```

The frontend visualizes the decisions generated by the backend.

---

#  Evaluation

The DRL approach can be compared against a conventional strategy such as keeping all base stations continuously active.



### Energy Saving

The percentage of energy saved can be calculated using:

```text
Energy Saving (%) =
((E_baseline - E_DRL) / E_baseline) × 100
```

---

#  Concepts Demonstrated

This project combines concepts from several areas of engineering and computer science:

### 5G / Wireless Communication

* 5G cellular networks
* Base station operation
* User association
* Network coverage
* SINR
* Radio resource utilization
* Traffic modeling

### Artificial Intelligence

* Reinforcement Learning
* Deep Reinforcement Learning
* DQN
* Reward engineering
* State/action representation
* Policy learning

### Software Development

* React
* REST APIs
* WebSockets
* Python
* Frontend/backend integration
* Git/GitHub
* Deployment

### Visualization

* Interactive network maps
* Animated users
* Base station state transitions
* Real-time metrics
* Decision explanations

---

#  Future Improvements

Potential future extensions include:

* PPO-based optimization
* Multi-agent reinforcement learning
* Dynamic user mobility models
* Cell load balancing
* Handover-aware energy optimization
* More realistic 5G NR traffic models
* Beamforming-aware energy optimization
* Near-field / XL-MIMO extension
* Multi-objective optimization
* Carbon-aware network optimization
* Integration with real 5G network datasets
* Hardware/software network testbed integration

---

#  Simulation Disclaimer

This project is an **educational software simulation** of 5G base station energy optimization.

The network, traffic, energy consumption, coverage, SINR, and DRL behavior are modeled computationally and do not represent measurements from a commercial 5G network.



---


If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
