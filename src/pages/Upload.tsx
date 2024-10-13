import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon } from 'lucide-react';
import axios from 'axios';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setError('Please select an image file.');
        setFile(null);
        setPreview(null);
      }
    }
  };

  const analyzeImage = async (imageData: string) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/analyze-image',
        { imageData }
      );
      return response.data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze the image');
    }
  };

  const extractJSON = (text: string) => {
    const jsonMatch = text.match(/\{.*\}/s);
    return jsonMatch ? jsonMatch[0] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const imageData = base64Data.split(',')[1];

        const analysisResult = await analyzeImage(imageData);
        const jsonData = extractJSON(analysisResult);

        if (jsonData) {
          const parsedData = JSON.parse(jsonData);
          localStorage.setItem('extractedBillData', JSON.stringify(parsedData));
          navigate('/edit/new');
        } else {
          setError('Failed to extract bill data. Please try again.');
        }
      };
    } catch (error) {
      console.error('Error processing receipt:', error);
      setError(
        'An error occurred while processing the receipt. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Receipt</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
        </div>
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Receipt preview"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Process Receipt'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
