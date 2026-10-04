import { useEffect, useState } from "react";
import UploadArea from "../../components/UploadArea/UploadArea";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../utils/api";
import type { KnowledgeDoc } from "../../utils/api";
import "./KnowledgeBase.css";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadDocument(file);

      if (res.data) {
        setDocuments((currentDocuments) => [
          res.data!,
          ...currentDocuments,
        ]);
      }
    } catch (err) {
      console.error("Failed to upload document:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload document.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);

    try {
      await deleteDocument(id);

      setDocuments((currentDocuments) =>
        currentDocuments.filter((doc) => doc._id !== id),
      );
    } catch (err) {
      console.error("Failed to delete document:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete document.",
      );
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data || []);
      } catch (err) {
        console.error("Failed to load documents:", err);

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

        <UploadArea
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
        />
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
    </section>
  );
}
