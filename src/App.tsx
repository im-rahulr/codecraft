import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PhotoGrid from './components/PhotoGrid';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchBar />
      <PhotoGrid />
    </div>
  );
}
