import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, DollarSign, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Restaurant Bill Splitter</h1>
      <p className="text-xl mb-8">Split your restaurant bills easily and fairly with our smart bill processing system.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <FeatureCard
          icon={<Upload className="w-12 h-12 mb-4 text-blue-500" />}
          title="Upload Receipt"
          description="Simply upload a photo of your receipt to get started."
        />
        <FeatureCard
          icon={<DollarSign className="w-12 h-12 mb-4 text-green-500" />}
          title="Automatic Extraction"
          description="Our system will extract all the details from your receipt."
        />
        <FeatureCard
          icon={<Users className="w-12 h-12 mb-4 text-purple-500" />}
          title="Fair Splitting"
          description="Easily split the bill among friends with just a few clicks."
        />
      </div>
      <Link
        to="/upload"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
      >
        Get Started
      </Link>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {icon}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Home;