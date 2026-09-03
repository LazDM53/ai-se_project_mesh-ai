import { useEffect, useState } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";


export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
 // const [isLoading, setIsLoading] = useState<boolean>(true);
 // const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };

    setDocuments([newDoc, ...documents]);
  };

useEffect(() => {
  console.log(documents);
}, [documents]);

  return (
    <div className="knowledge-base">
      <h1>Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <p>Upload documents (PDF)</p>

        <UploadArea onFileSelect={handleFileSelect} />

        <div className="knowledge-base__documents"></div>

        <button className="knowledge-base__save">Save</button>
      </section>
    </div>
  );
}