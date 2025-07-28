"use client";
import { Suspense } from "react";
import { Editor } from "@/components/Editor";

export default function VividVoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="max-w-3xl mx-auto p-4">
        <Editor />
      </main>
    </Suspense>
  );
}
