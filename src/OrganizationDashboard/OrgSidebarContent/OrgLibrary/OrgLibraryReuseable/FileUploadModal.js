import { useEffect } from "react";

const FileUploadModal = ({ show, onHide, file, onUpload, progress, onProgress }) => {
    useEffect(() => {
        if (file) {
            // Handle file upload logic and notify parent component when complete
            onUpload(file);
        }
    }, [file, onUpload]);

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">File Upload</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <div className="progress">
                            <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }}>
                                {progress === -1 ? 'Uploading...' : `${progress}%`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUploadModal;
