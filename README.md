# NYC 911 Incident Management System

A robust full-stack application designed to manage, track, and analyze live emergency incidents across New York City. This system streamlines incident reporting, unit dispatch, and historical data analysis for public safety operations with real-time updates and detailed geospatial integration.

> **Note:** This repository contains only the backend API and frontend dashboard components. The radio monitoring hardware, Whisper transcription model, and LLM processing pipeline mentioned in this README are separate, currently closed-source components that integrate with this system.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture and Modules](#architecture-and-modules)
- [Built With](#built-with)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Starting the Application](#starting-the-application)
  - [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Data Flow](#data-flow)
- [AI and Audio Processing](#ai-and-audio-processing)
- [Hardware Setup](#hardware-setup)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## Overview

The NYC 911 Incident Management System is built to help emergency response teams capture, process, and manage 911 calls in real time. By converting textual addresses into accurate geospatial coordinates, the system ensures that each incident is precisely mapped, validated, and correlated with jurisdictional data. All incidents are trackable from creation to completion, and detailed histories of incident data are available in an easy to use dashboard.

While this repository focuses on the core backend and frontend components, the complete system also integrates with separate, proprietary components for radio monitoring and AI-powered transcription. These complementary systems automatically capture radio transmissions, transcribe them using AI, extract relevant incident information, and interact with this system's APIs to create and update incidents.

---

## Features

- **Real-Time Incident Reporting**
  - Capture incoming 911 calls with accurate timestamps in Eastern Standard Time.
  - Perform duplicate detection using both text-based addresses and unique map node IDs.
  - Update incidents with additional notes and reassign units as new information is received.

- **Geospatial and Mapping Integration**
  - Convert addresses into latitude and longitude via an external Maps API.
  - Enrich incident data with detailed mapping information: precinct, patrol borough, sector, and formatted address.
  - Execute spatial queries to validate incident locations using GeoJSON data and SQL functions.

- **Dynamic Unit Dispatch and Management**
  - Specific units are fully tracked throughout all the calls they are on, and unit histories are available to view.
  - Unit assignments are updated dynamically based on incoming calls and incident status.
  - For larger incidents, all units on the assignment are properly tracked and detailed on the dashboard.

- **Incident History and Audit Trail**
  - Closed incidents are archived in a dedicated table while retaining full historical data, and easily searchable by address via the dashboard.
  - Comprehensive notes and updates are implemented for each incident, creating a complete audit trail. Incidents are easily updated by the application middlelayer.
  - Detailed analysis functions are available to analyze past incident data to find recurring patterns and improve response strategies.

- **Security and Access Control**
  - Implement API key and JWT token validation to secure endpoints.
  - Use robust error handling and logging (via Elysia and custom logger utilities) to manage issues in real time.

- **Automated Radio Monitoring and Transcription**
  - Capture and process emergency radio communications in real-time.
  - Transcribe radio communications to text using a fine-tuned Whisper AI model.
  - Extract structured incident data from transcriptions using LLM processing.
  - Automatically create and update incidents based on radio communications.

---

## Architecture and Modules

The application is organized into modular components that work together seamlessly:

- **Incident Lifecycle Module**
  - Handles creation, update, and archival of incident records.
  - Implements duplicate detection based on user input (addresses) and map data (node IDs).

- **Mapping and Geolocation Module**
  - Interfaces with external mapping services to retrieve geospatial data.
  - Processes API responses to extract relevant data like coordinates, precinct information, and formatted addresses.

- **Dispatch and Unit Management Module**
  - Manages the assignment, reassignment, and preemption of units.
  - Uses SQL array functions to update unit lists and change incident statuses based on unit availability.

- **Authentication and Logging Module**
  - Secures API endpoints with API key checks and JWT-based authentication.
  - Logs key events (info, debug, error) to aid troubleshooting and ensure transparency.

- **Radio Monitoring Module**
  - Uses Trunk Recorder to capture P25 & SmartNet radio transmissions.
  - Processes and uploads radio clips for transcription.

- **AI Transcription Module**
  - Custom Python package for processing radio audio data.
  - Fine-tuned Whisper model optimized for emergency radio communications.
  - LLM-based natural language understanding to structure incident data.
  - Intelligent API integration to update the main system.

- **Frontend Module**
  - Interactive dashboard for real-time incident management.
  - Unit status monitoring and assignment tracking.
  - Historical data visualization and reporting.

---

## Built With

### Backend
- **[Bun.js](https://bun.sh):** A fast JavaScript runtime for modern web applications.
- **[Drizzle ORM](https://orm.drizzle.team/):** Provides type-safe database operations.
- **[Luxon](https://moment.github.io/luxon/):** Handles date and time management in Eastern Standard Time.
- **[Elysia](https://elysia.dev/):** A lightweight Bun.js framework for routing and error management.
- **SQL databases with spatial extensions (e.g., PostGIS for PostgreSQL)** for geospatial queries.

### Frontend
- **[NextJS](https://nextjs.org/):** A React framework for building scalable applications.
- **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.

### AI Processing
- **Fine-tuned Whisper model:** Custom-trained on radio communications for accurate transcription.
- **Large Language Model (LLM):** For natural language understanding and structured data extraction.
- **Custom Python package:** For audio processing and API integration.

### Hardware
- **Airspy R2:** Software-defined radio (SDR) receiver.
- **Raspberry Pi setup running [Trunk Recorder](https://github.com/robotastic/trunk-recorder):** For capturing and recording trunked radio system transmissions.

---

## Data Flow

> **Note:** The following describes the complete system architecture including proprietary components that are not included in this repository but integrate with it.

1. **Radio Transmission Capture:** *(Closed-source component)*
   - Emergency radio communications are captured via the Airspy R2 hardware.
   - [Trunk Recorder]([url](https://github.com/robotastic/trunk-recorder)) software records P25 & SmartNet radio transmissions and segments them into 30-second clips.

2. **Audio Processing and Transcription:** *(Closed-source component)*
   - Audio clips are uploaded to the AI Transcription Module.
   - Custom fine-tuned Whisper model transcribes radio audio to text.
   - LLM processes the transcription to extract structured incident data.

3. **Incident Creation and Management:** *(This repository)*
   - External AI module calls this system's APIs to create or update incidents.
   - System validates geospatial data and assigns appropriate emergency units.
   - Real-time updates are reflected in the frontend dashboard.

4. **Data Storage and Analysis:** *(This repository)*
   - Incident data is stored in spatial-enabled SQL databases.
   - Historical data is available for analysis and reporting.
   - Patterns and trends can be identified to improve emergency response strategies.

---

## AI and Audio Processing

> **Note:** The following components are **not included** in this repository but are described here to provide context on the complete system architecture.

The complete system incorporates a sophisticated AI pipeline for processing emergency radio communications:

- **Custom Whisper Model:** The standard Whisper model has been fine-tuned on a specialized dataset of emergency radio communications to improve transcription accuracy for police and emergency services terminology, radio artifacts, and communication patterns.

- **Audio Processing:** A private Python package handles the processing of radio audio clips, including noise reduction, normalization, and preparation for the Whisper model.

- **Natural Language Understanding:** After transcription, an LLM interprets the content of the communication, extracting key information such as:
  - Incident type and priority
  - Location and address details
  - Unit identifiers
  - Status updates and situation reports

- **Intelligent API Integration:** Based on the extracted information, the system automatically determines which API endpoints to call and what data to send, creating new incidents or updating existing ones as appropriate.

There are **potential plans to open-source** these AI components in the future, but they are currently closed-source and proprietary.

---

## Hardware Setup

> **Note:** The following hardware configuration is **not included** in this repository but is described here to provide context on the complete system.

The complete system includes a custom hardware configuration for radio monitoring:

- **Airspy R2:** A high-performance software-defined radio (SDR) receiver capable of capturing a wide range of frequencies used by emergency services.

- **Trunk Recorder Configuration:** Running on a Linux system, Trunk Recorder is configured to monitor P25 and SmartNet trunked radio systems used by NYC emergency services.

- **Audio Processing Pipeline:** The system automatically:
  1. Captures relevant radio transmissions
  2. Records them as 30-second audio clips
  3. Uploads them to the AI processing service
  4. Processes the response to update the incident management system

---

## Contact

Brian - [@shadow173](https://github.com/shadow173) - brian@triad-dev.com

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
