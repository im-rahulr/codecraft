import React from "react";
import { ArrowLeft, Upload } from "lucide-react";
import UploadWidget from "./UploadWidget";

interface UploadPageProps {
  onBackHome: () => void;
  onUploadComplete?: () => void;
}

export default function UploadPage({
  onBackHome,
  onUploadComplete,
}: UploadPageProps) {
  return (
    <main className="px-4 py-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-3xl mx-auto space-y-4">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to photos
        </button>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Upload files</h1>
              <p className="mt-1 text-sm text-gray-600">
                Select images or videos, enter the upload password, and send them directly to the API.
              </p>
            </div>
          </div>

          <UploadWidget onUploadComplete={onUploadComplete} />
        </section>
      </div>
    </main>
  );
}