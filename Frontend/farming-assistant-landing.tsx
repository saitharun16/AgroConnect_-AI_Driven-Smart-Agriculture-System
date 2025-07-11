import React, { useState, useRef } from 'react';
import { Camera, Upload, ImageIcon, ArrowRight, Sun, Leaf, AlertTriangle, Cpu } from 'lucide-react';

const FarmingAssistantLanding = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Start camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or not available");
      setCameraActive(false);
    }
  };

  // Take a photo from camera
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL('image/png');
      setSelectedImage(imageUrl);
      
      // Stop camera stream
      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      setCameraActive(false);
    }
  };

  // Cancel camera use
  const cancelCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    setCameraActive(false);
  };

  // Proceed to dashboard
  const proceedToDashboard = () => {
    setIsLoading(true);
    // Simulate image processing and API call
    setTimeout(() => {
      // In a real app, you would upload the image to your server here
      // and then redirect to the dashboard with the result ID
      window.location.href = "/dashboard"; // Replace with actual redirect
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 font-sans">
      {/* Header */}
      <header className="max-w-4xl mx-auto bg-green-700 text-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex items-center">
          <Leaf size={32} className="mr-3" />
          <h1 className="text-3xl font-bold">Farming Assistant</h1>
        </div>
        <p className="mt-2 opacity-90">Your smart companion for better farming decisions</p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Introduction Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Analyze Your Crops</h2>
          <p className="text-gray-700 mb-4">
            Take a photo of your crops or upload an existing image to get personalized insights, weather forecasts, and planting recommendations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Sun className="mx-auto text-yellow-500 mb-2" size={28} />
              <h3 className="font-medium">Weather Forecasts</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Leaf className="mx-auto text-green-500 mb-2" size={28} />
              <h3 className="font-medium">Crop Recommendations</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={28} />
              <h3 className="font-medium">Pest & Disease Alerts</h3>
            </div>
          </div>
        </section>

        {/* Image Upload/Camera Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Upload or Take a Photo</h2>
          
          {/* Input options */}
          {!cameraActive && !selectedImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={handleUploadClick}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 flex flex-col items-center justify-center transition-colors"
              >
                <Upload size={48} className="mb-4" />
                <span className="text-lg font-medium">Upload from Gallery</span>
                <span className="text-sm opacity-80 mt-1">Select an existing photo</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>

              <button 
                onClick={startCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 flex flex-col items-center justify-center transition-colors"
              >
                <Camera size={48} className="mb-4" />
                <span className="text-lg font-medium">Take a Photo</span>
                <span className="text-sm opacity-80 mt-1">Use your device camera</span>
              </button>
            </div>
          )}

          {/* Camera view */}
          {cameraActive && (
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="rounded-lg border-4 border-blue-500 max-w-full mx-auto"
                  style={{ maxHeight: '50vh' }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={takePhoto}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 flex items-center justify-center"
                >
                  <Camera size={20} className="mr-2" />
                  Take Photo
                </button>
                <button 
                  onClick={cancelCamera}
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Selected Image Preview */}
          {selectedImage && !isLoading && (
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img 
                  src={selectedImage} 
                  alt="Selected crop" 
                  className="rounded-lg border-4 border-green-500 max-w-full mx-auto" 
                  style={{ maxHeight: '50vh' }}
                />
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={proceedToDashboard}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 flex items-center justify-center"
                >
                  <ArrowRight size={20} className="mr-2" />
                  Analyze Image
                </button>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg px-6 py-3"
                >
                  Choose Another
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mb-4"></div>
              <p className="text-lg">Analyzing your image...</p>
              <p className="text-sm text-gray-600 mt-2">This will just take a moment</p>
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Camera className="text-green-700" />
              </div>
              <h3 className="font-medium mb-2">1. Take a Photo</h3>
              <p className="text-gray-600 text-sm">Capture your crops or upload an existing image</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Cpu className="text-green-700" />
              </div>
              <h3 className="font-medium mb-2">2. AI Analysis</h3>
              <p className="text-gray-600 text-sm">Our AI analyzes your crops and local conditions</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Leaf className="text-green-700" />
              </div>
              <h3 className="font-medium mb-2">3. Get Insights</h3>
              <p className="text-gray-600 text-sm">Receive personalized recommendations</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-600 p-4">
        <p>© 2025 Farming Assistant | Your Smart Farming Companion</p>
      </footer>
    </div>
  );
};

export default FarmingAssistantLanding;
