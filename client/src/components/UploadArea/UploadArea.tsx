import "./UploadArea.css";
import UploadIcon from "../../assets/upload.png";

type Props = {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
};

export default function UploadArea({
  onFileSelect,
  isUploading,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && !isUploading) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="upload-area"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="upload-area__label">
        <img
          src={UploadIcon}
          alt="Upload PDF"
          className="upload-area__icon"
        />

        <span className="upload-area__text">
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              Drag and drop a PDF, or{" "}
              <span className="underline">Upload</span>
            </>
          )}
        </span>

        <input
          type="file"
          accept=".pdf"
          className="upload-area__input"
          onChange={handleChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}