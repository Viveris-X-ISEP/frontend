# Projet Industriel - Frontend

A React Native mobile application built with [Expo](https://expo.dev) for the Green Team eco-actions platform.

## Table of Contents

- [Projet Industriel - Frontend](#projet-industriel---frontend)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Configure environment variables](#3-configure-environment-variables)
    - [4. Start the development server](#4-start-the-development-server)
    - [5. Run on your device](#5-run-on-your-device)
    - [Tunnel Mode (Remote Access)](#tunnel-mode-remote-access)
  - [Project Structure](#project-structure)
  - [Architecture](#architecture)
    - [Feature-Based Organization](#feature-based-organization)
    - [Key Technologies](#key-technologies)
  - [Available Scripts](#available-scripts)
  - [Environment Configuration](#environment-configuration)
  - [Testing](#testing)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Bun** - [Install](https://bun.sh/)
- **Expo CLI** - Install globally: `bun install -g expo-cli`
- **Expo Go** app on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HM-Isep/projet-industriel-front.git
cd projet-industriel-front
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
# API URL - Replace with your backend server address
# Use your local IP (not localhost) when testing on physical devices
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:8080/ProjetIndustrielBack
```

> **Note:** To find your local IP:
> - **Windows:** Run `ipconfig` and look for IPv4 Address
> - **macOS/Linux:** Run `ifconfig` or `ip addr`

### 4. Start the development server

```bash
npx expo start
```

### 5. Run on your device

- **Physical device:** Scan the QR code with Expo Go (Android) or Camera app (iOS)
- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Web browser:** Press `w` in the terminal

### Tunnel Mode (Remote Access)

If your device can't connect to your local network:

```bash
npx expo start --tunnel
```

## Project Structure

The project follows a **Maven-inspired directory layout** adapted for TypeScript/React Native:

```
.
└── src
    ├── main
    │   ├── resources
    │   │   ├── config
    │   │   ├── fonts
    │   │   └── images
    │   └── typescript
    │       ├── app                    # Expo Router file-based routing
    │       │   ├── (tabs)             # Tab navigation screens
    │       │   │   ├── (home)
    │       │   │   ├── community
    │       │   │   ├── missions
    │       │   │   ├── profile
    │       │   │   └── settings
    │       │   ├── auth               # Authentication screens
    │       │   ├── mission
    │       │   │   ├── detail
    │       │   │   └── update
    │       │   ├── questionnaire
    │       │   └── user
    │       ├── features               # Feature modules
    │       │   ├── auth
    │       │   │   ├── components
    │       │   │   ├── hooks
    │       │   │   ├── services
    │       │   │   └── types
    │       │   ├── community
    │       │   ├── home
    │       │   ├── mission
    │       │   ├── missions
    │       │   ├── profile
    │       │   ├── questionnaire
    │       │   ├── settings
    │       │   └── user
    │       ├── shared                 # Shared utilities
    │       │   ├── api                # API client (Axios)
    │       │   ├── components         # Reusable UI components
    │       │   └── theme              # Theming system
    │       ├── store                  # Global state (Zustand)
    │       └── utility                # Helper functions
    └── test
        ├── integration
        └── typescript
            └── features
                └── auth
                    └── services
```

## Architecture

### Feature-Based Organization

Each feature module follows a consistent structure:

| Folder | Purpose |
|--------|---------|
| `components/` | React Native UI components |
| `hooks/` | Custom React hooks (business logic) |
| `services/` | API calls and data fetching |
| `types/` | TypeScript interfaces and types |

### Key Technologies

- **Expo** - React Native development framework
- **Expo Router** - File-based navigation
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **expo-secure-store** - Secure token storage

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun start` | Start Expo development server |
| `bun run android` | Run on Android emulator/device |
| `bun run ios` | Run on iOS simulator/device |
| `bun run web` | Run in web browser |
| `bun run lint` | Run ESLint |
| `bun test` | Run Jest tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |

## Environment Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `http://192.168.1.90:8080/ProjetIndustrielBack` |

> **Important:** Environment variables prefixed with `EXPO_PUBLIC_` are exposed to the client. Never store secrets here.

## Testing

Run the test suite:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun run test:watch

# Generate coverage report
bun run test:coverage
```

Tests are located in `src/test/typescript/` mirroring the main source structure.
