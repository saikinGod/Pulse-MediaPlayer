# PULSE-MEDIAPLAYER

<div align="center">

![favicon](image.png)

![PULSE-MEDIAPLAYER Banner](https://img.shields.io/badge/PULSE-MEDIAPLAYER-dc2626?style=for-the-badge&logo=music&logoColor=white)

**Your Futuristic Media Hub**

A modern, sleek media player web application for uploading, organizing, and playing your music and video files.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react)](https://reactjs.org/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Browser Support](#-browser-support)
- [Limitations](#-limitations)
- [Contributing](#-contributing)
- [Academic Purpose](#-academic-purpose)

---

## About

**PULSE-MEDIAPLAYER** is a fully client-side media player web application built for academic purposes. It allows users to upload their music and video files or add direct media URLs, which are then stored locally in the browser using localStorage. The application features a modern, futuristic design with smooth animations and an intuitive user interface.

### Key Highlights

- **100% Frontend** - No backend or server required
- **Local Storage** - All media stored in browser localStorage
- **Modern UI** - Sleek, futuristic design with glassmorphism effects
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Multi-Format** - Supports MP3, MP4, WAV, OGG, WebM, and more
- **Fast & Lightweight** - Built with Next.js and Tailwind CSS

---

##  Features

### Media Management
- **Drag & Drop Upload** - Simply drag and drop your media files
- **URL Support** - Add direct links to online media
- **Music Library** - Organize and manage your music tracks
- **Video Library** - Store and access your video files
- **Playlists** - Create custom playlists for your media
- **Recently Played** - Quick access to recently played items

### User Interface
- **Dark Theme** - Eye-friendly dark interface
- **Smooth Animations** - Fluid transitions and hover effects
- **Glassmorphism Design** - Modern glass-like UI elements
- **Visual Feedback** - Interactive drag states and hover effects
- **Responsive Layout** - Adapts to all screen sizes

### Technical Features
- **LocalStorage Integration** - Persistent data storage
- **Client-Side Only** - No data sent to external servers
- **Optimized Performance** - Fast loading and smooth playback
- **Type Safety** - Built with modern React patterns

---

## Demo

### Screenshots

#### Main Upload Interface
![Upload Interface](https://via.placeholder.com/800x400/0a0a0f/dc2626?text=Upload+Interface)

#### Media Library
![Media Library](https://via.placeholder.com/800x400/0a0a0f/a855f7?text=Media+Library)

#### Drag & Drop in Action
![Drag and Drop](https://via.placeholder.com/800x400/0a0a0f/00d4ff?text=Drag+%26+Drop)

> **Note:** Replace placeholder images with actual screenshots of your application

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14+ | React framework for production |
| **React** | 18+ | UI component library |
| **Tailwind CSS** | 3+ | Utility-first CSS framework |
| **Lucide React** | Latest | Modern icon library |

### Additional Tools
- **JavaScript (ES6+)** - Programming language
- **LocalStorage API** - Browser storage
- **HTML5 Media APIs** - Audio/Video playback

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** package manager

### Step-by-Step Guide

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pulse-mediaplayer.git
cd pulse-mediaplayer
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

## 📖 Usage

### Uploading Media Files

1. **Drag & Drop Method**
   - Drag your media files from your computer
   - Drop them into the designated upload zone
   - Files will be processed and stored locally

2. **Click to Browse Method**
   - Click on the upload zone
   - Select files from your file explorer
   - Click "Open" to upload

3. **URL Method**
   - Paste a direct media URL in the input field
   - Click "Add URL" or press Enter
   - Media will be added to your library

### Supported File Formats

- **Audio:** MP3, WAV, OGG, M4A
- **Video:** MP4, WebM, OGV, MOV

### Managing Your Library

- **Music Library** - Access all your uploaded music tracks
- **Video Library** - Browse your video collection
- **Playlists** - Create and manage custom playlists
- **Recently Played** - Quick access to recent media

---

## 📁 Project Structure

```
pulse-mediaplayer/
├── app/
│   ├── page.js                 # Main page component
│   ├── layout.js               # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── UserUpload.jsx          # Upload interface component
│   ├── MediaPlayer.jsx         # Media player component
│   ├── Library.jsx             # Library view component
│   └── Playlist.jsx            # Playlist component
├── public/
│   ├── icons/                  # App icons
│   └── images/                 # Static images
├── utils/
│   ├── storage.js              # LocalStorage utilities
│   └── mediaHelpers.js         # Media processing helpers
├── package.json                # Project dependencies
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── README.md                   # Project documentation
```

---

## 🌐 Browser Support

PULSE-MEDIAPLAYER works on all modern browsers that support:
- LocalStorage API
- HTML5 Audio/Video
- ES6+ JavaScript
- CSS Grid & Flexbox

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## ⚠️ Limitations

### Storage Constraints
- **LocalStorage Limit:** Most browsers limit localStorage to 5-10MB
- **Large Files:** Not suitable for very large video files
- **Browser Dependency:** Data is tied to specific browser and device

### Recommendations
- Use for small to medium-sized media files
- For larger libraries, consider using IndexedDB or external storage
- Clear browser cache may delete stored media

### Best Practices
- Keep individual files under 5MB for optimal performance
- Use compressed formats (MP3, MP4) when possible
- Regularly backup important media files

---

## 🤝 Contributing

This is an academic project, but contributions are welcome for learning purposes!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 🎓 Academic Purpose

This project was created for **educational and academic purposes** to demonstrate:

- Modern web development practices
- React and Next.js fundamentals
- State management with React hooks
- Browser storage APIs (localStorage)
- Responsive design with Tailwind CSS
- File upload and handling
- Media playback in web browsers

### Learning Outcomes
- Understanding client-side storage solutions
- Implementing drag-and-drop functionality
- Creating modern UI with glassmorphism effects
- Building responsive web applications
- Working with media APIs

---

### Reporting Issues
Found a bug or have a suggestion? Please open an issue on GitHub with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind Labs** - For the utility-first CSS framework
- **Lucide Icons** - For the beautiful icon library
- **Academic Advisors** - For guidance and support

---

## 📝 Disclaimer

This application stores all data locally in your browser. We do not collect, store, or transmit any user data to external servers. Users are responsible for managing their own media files and ensuring they have the rights to upload and play the content.

---

<div align="center">

**Made with ❤️ for Academic Learning**

⭐ Star this repo if you find it helpful!

![PULSE-MEDIAPLAYER](https://img.shields.io/badge/PULSE-MEDIAPLAYER-dc2626?style=for-the-badge)

</div>