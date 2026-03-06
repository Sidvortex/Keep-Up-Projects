import { VideoInfo, VideoFormat, AudioFormat, TranscriptInfo } from './types';

export const mockVideoInfo: VideoInfo = {
  id: 'dQw4w9WgXcQ',
  title: 'Build a Complete Full-Stack App with React, Node.js & MongoDB - 4 Hour Tutorial',
  channel: 'TechMaster Pro',
  duration: '4:02:35',
  views: '2,458,392',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
  description: 'In this comprehensive tutorial, you will learn how to build a complete full-stack web application from scratch using React for the frontend, Node.js and Express for the backend, and MongoDB for the database. We cover authentication, CRUD operations, deployment, and more!',
  uploadDate: 'Dec 15, 2024',
  likes: '89,234',
  subscribers: '1.2M',
};

export const mockVideoFormats: VideoFormat[] = [
  { id: 'v1', quality: '2160p (4K)', format: 'MP4', size: '3.8 GB', fps: '60fps', codec: 'H.265', available: true },
  { id: 'v2', quality: '1440p (2K)', format: 'MP4', size: '2.1 GB', fps: '60fps', codec: 'H.264', available: true },
  { id: 'v3', quality: '1080p (FHD)', format: 'MP4', size: '1.2 GB', fps: '60fps', codec: 'H.264', available: true },
  { id: 'v4', quality: '1080p (FHD)', format: 'WEBM', size: '1.0 GB', fps: '30fps', codec: 'VP9', available: true },
  { id: 'v5', quality: '720p (HD)', format: 'MP4', size: '680 MB', fps: '30fps', codec: 'H.264', available: true },
  { id: 'v6', quality: '720p (HD)', format: 'WEBM', size: '540 MB', fps: '30fps', codec: 'VP9', available: true },
  { id: 'v7', quality: '480p (SD)', format: 'MP4', size: '320 MB', fps: '30fps', codec: 'H.264', available: true },
  { id: 'v8', quality: '360p', format: 'MP4', size: '180 MB', fps: '30fps', codec: 'H.264', available: true },
  { id: 'v9', quality: '240p', format: 'MP4', size: '95 MB', fps: '30fps', codec: 'H.264', available: true },
  { id: 'v10', quality: '144p', format: 'MP4', size: '45 MB', fps: '15fps', codec: 'H.264', available: true },
  { id: 'v11', quality: '2160p (4K)', format: 'AVI', size: '5.2 GB', fps: '60fps', codec: 'H.265', available: false },
  { id: 'v12', quality: '1080p (FHD)', format: 'MKV', size: '1.4 GB', fps: '60fps', codec: 'H.265', available: false },
];

export const mockAudioFormats: AudioFormat[] = [
  { id: 'a1', quality: 'Ultra High', format: 'FLAC', bitrate: '1411 kbps', size: '245 MB', available: true },
  { id: 'a2', quality: 'High', format: 'MP3', bitrate: '320 kbps', size: '56 MB', available: true },
  { id: 'a3', quality: 'High', format: 'AAC', bitrate: '256 kbps', size: '48 MB', available: true },
  { id: 'a4', quality: 'High', format: 'OGG', bitrate: '256 kbps', size: '44 MB', available: true },
  { id: 'a5', quality: 'Medium', format: 'MP3', bitrate: '192 kbps', size: '34 MB', available: true },
  { id: 'a6', quality: 'Medium', format: 'AAC', bitrate: '128 kbps', size: '24 MB', available: true },
  { id: 'a7', quality: 'Low', format: 'MP3', bitrate: '64 kbps', size: '12 MB', available: true },
  { id: 'a8', quality: 'Ultra High', format: 'WAV', bitrate: '1411 kbps', size: '380 MB', available: false },
  { id: 'a9', quality: 'High', format: 'ALAC', bitrate: '1000 kbps', size: '210 MB', available: false },
];

export const mockTranscripts: TranscriptInfo[] = [
  {
    language: 'English',
    available: true,
    entries: [
      { time: '0:00', text: 'Hey everyone! Welcome back to the channel.' },
      { time: '0:05', text: 'Today we are going to build a complete full-stack application.' },
      { time: '0:12', text: "We'll be using React for the frontend with Tailwind CSS for styling." },
      { time: '0:20', text: 'For the backend, we will use Node.js with Express framework.' },
      { time: '0:28', text: 'And MongoDB will serve as our database solution.' },
      { time: '0:35', text: "Let's start by setting up our project structure." },
      { time: '0:42', text: "First, create a new directory and initialize the project." },
      { time: '0:50', text: 'Run npm init to set up the package.json file.' },
      { time: '1:00', text: 'Now install the required dependencies: express, mongoose, cors.' },
      { time: '1:10', text: "Let's also install dotenv for environment variables." },
      { time: '1:20', text: 'Create a server.js file in the root directory.' },
      { time: '1:30', text: 'Import express and set up the basic server configuration.' },
      { time: '1:45', text: 'Next, we connect to our MongoDB database.' },
      { time: '2:00', text: "Let's define our data models using Mongoose schemas." },
      { time: '2:15', text: 'The User model will have name, email, and password fields.' },
      { time: '2:30', text: 'Now we create the API routes for CRUD operations.' },
      { time: '2:45', text: 'The POST route handles creating new users.' },
      { time: '3:00', text: 'GET route retrieves all users from the database.' },
      { time: '3:15', text: "Let's add authentication using JSON Web Tokens." },
      { time: '3:30', text: 'Hash passwords with bcrypt before storing them.' },
    ],
  },
  {
    language: 'Spanish',
    available: true,
    entries: [
      { time: '0:00', text: '¡Hola a todos! Bienvenidos de vuelta al canal.' },
      { time: '0:05', text: 'Hoy vamos a construir una aplicación full-stack completa.' },
      { time: '0:12', text: 'Usaremos React para el frontend con Tailwind CSS.' },
      { time: '0:20', text: 'Para el backend, usaremos Node.js con Express.' },
      { time: '0:28', text: 'Y MongoDB será nuestra solución de base de datos.' },
    ],
  },
  { language: 'French', available: true, entries: [
    { time: '0:00', text: 'Salut tout le monde! Bienvenue sur la chaîne.' },
    { time: '0:05', text: "Aujourd'hui, nous allons créer une application full-stack complète." },
  ]},
  { language: 'German', available: false },
  { language: 'Japanese', available: false },
  { language: 'Korean', available: false },
  { language: 'Portuguese', available: false },
  { language: 'Hindi', available: true, entries: [
    { time: '0:00', text: 'नमस्ते दोस्तों! चैनल पर वापस स्वागत है।' },
    { time: '0:05', text: 'आज हम एक पूर्ण फुल-स्टैक एप्लीकेशन बनाएंगे।' },
  ]},
  { language: 'Chinese (Simplified)', available: false },
  { language: 'Arabic', available: false },
];
