import { useEffect, useState } from "react";
import { getDocuments } from "../../utils/api";
import UploadArea from "../../components/UploadArea/UploadArea";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };

    setDocuments((currentDocuments) => [
      newDoc,
      ...currentDocuments,
    ]);
  };

  const handleDelete = (id: string) => {
    setDocuments((currentDocuments) =>
      currentDocuments.filter((doc) => doc._id !== id)
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data || []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="knowledge-base">
      <h1 className="knowledge-base__title">
        Manage Your Knowledge Base
      </h1>

      <div className="knowledge-base__document-upload">
        <p className="knowledge-base__upload-label">
          Upload documents (PDF)
        </p>

        <UploadArea onFileSelect={handleFileSelect} />
      </div>

      <div className="knowledge-base__documents">
        {isLoading && <p>Loading...</p>}

        {!isLoading && error && <p>{error}</p>}

        {!isLoading && !error && documents.length === 0 && (
          <p>No documents yet.</p>
        )}

        {!isLoading && !error && documents.length > 0 && (
          <>
            {documents.map((doc) => (
              <div
                className="knowledge-base__document"
                key={doc._id}
              >
                <span>{doc.fileName}</span>

                <button
                  type="button"
                  aria-label={`Delete ${doc.fileName}`}
                  onClick={() => handleDelete(doc._id)}
                >
                  ×
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <button
        type="button"
        className="knowledge-base__save"
      >
        Save
      </button>
    </section>
  );
}

