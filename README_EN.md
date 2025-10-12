# Personal Web Navigator

A simple and easy-to-use personal website navigation page that supports adding, deleting, and managing commonly used website links.

[中文版本](README.md)

## Features

- Clean and beautiful responsive interface
- Website category management
- Add and delete website links
- Edit website information
- Hover to display operation buttons
- Automatic hiding animation for new websites
- Data persistence stored in `data.json` file
- Customizable website card background colors
- Drag and drop sorting functionality


![img](/index.png)

## Tech Stack

- Frontend: HTML, CSS, JavaScript (native implementation, no framework dependencies)
- Backend: Node.js + Express or Vercel Serverless Functions
- Data Storage: JSON files

## Directory Structure

```
.
├── index.html          # Main page
├── styles.css          # Stylesheet file
├── script.js           # Frontend JavaScript logic
├── server.js           # Local Node.js server
├── api/
│   └── save.js         # Vercel Serverless Function
├── data.json           # Website data storage file
├── package.json        # Project dependency configuration
└── vercel.json         # Vercel deployment configuration
```

## Usage Instructions

### Website Management
1. Click the "+" button in the bottom right corner to open the add website modal
2. Select a category, fill in the website name and link
3. Click the "Add Website" button to add the website
4. Hover over the top-right area of the website card to display edit and delete buttons
5. Click the "Edit" button to modify website information and background color
6. Click the "Delete" button to delete the corresponding website
7. Hover over the top-left area of the website card to drag and sort

### Data Storage
All data is automatically saved to the `data.json` file

## Notes

- Data is saved in the `data.json` file in the project root directory

- Ensure the server has file write permissions
