"use client"

import { Loader2 } from 'lucide-react'


function Loader() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  );
}


export default Loader