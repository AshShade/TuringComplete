
# TuringComplete Instruction Set Viewer

A modern web tool for browsing, searching, and visualizing a custom 32-bit instruction set, built with React, Vite, and Ant Design.

## Features
- Visualize a YAML-defined 32-bit instruction set
- Fuzzy search and type filtering
- Responsive dark theme UI
- Click to view detailed instruction info
- Colorful opcode binary visualization
- Deployable to GitHub Pages

## Project Structure
```
├── public/
│   └── instruction_set.yaml       # Instruction set definition
├── src/
│   ├── App.jsx                    # Main React app
│   ├── main.jsx                   # Entry point
│   ├── yaml.js                    # YAML parsing helper
│   ├── style.js, global.js        # Styles and theme
│   └── ...
├── vite.config.js                 # Vite config (with base for GitHub Pages)
├── package.json                   # Scripts and dependencies
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install dependencies
```sh
npm install
```

### 2. Run in development mode
```sh
npm run dev
```
Visit the local address shown in the terminal.

### 3. Build for production
```sh
npm run build
```
The static site will be output to the `dist/` directory.

### 4. Preview production build locally
```sh
npm run preview
```

## 5. Deploy to GitHub Pages
```sh
npm run deploy
```