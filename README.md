# Hot Dog Detector - SeeFood App

A hot dog detection app inspired by the Silicon Valley TV show. This app determines whether an image contains a hot dog or not (aka: "Not Hot Dog").

## Features

- 🌭 Detect hot dogs in images with AI
- 📸 Take photos with your camera
- 🖼️ Upload images from your device
- 🤣 Fun and humorous UI inspired by the show

## Technology Stack

- Next.js
- TypeScript
- TensorFlow.js with MobileNet model
- React Webcam for camera integration
- Tailwind CSS for styling

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

The app uses TensorFlow.js and a pre-trained MobileNet model to classify images. When you upload or take a photo, the app analyzes it to determine if it contains a hot dog. The model is loaded and run entirely in the browser - no server-side processing needed!

## Quote from the Show

> "What would you say if I told you there is an app on the market that could tell you if you have a hot dog or not a hot dog?"
> 
> - Jian-Yang, Silicon Valley

## License

MIT
