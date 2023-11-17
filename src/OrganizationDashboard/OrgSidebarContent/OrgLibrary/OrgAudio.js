import React, { useState } from 'react';
import pdfImage from '../../../asserts/images/pdfImage.png';
import zipImage from '../../../asserts/images/zipImage.png';
import jpgImage from '../../../asserts/images/jpgImage.png';
import docImage from '../../../asserts/images/docIamge.png';
import pngImage from '../../../asserts/images/pngImage.png';
import pptImage from '../../../asserts/images/pptImage.png';
import bmpImage from '../../../asserts/images/bmpImage.png';
import xlsxImage from '../../../asserts/images/xlsxImage.png';
import mp3Image from '../../../asserts/images/mp3Image.png';
import mp4Image from '../../../asserts/images/mp4Image.png';

import './OrgAudio.css'; // Import the CSS file for styling

function OrgAudio(props) {
    const extensionToImage = {
        pdf: pdfImage,
        zip: zipImage,
        jpg: jpgImage,
        docx: docImage,
        png: pngImage,
        pptx: pptImage,
        bmp: bmpImage,
        xlsx: xlsxImage,
        mp3: mp3Image,
        mp4: mp4Image,
    };

    const [activeTab, setActiveTab] = useState('all');
    const [show, setShow] = useState(false);

    const handleDownload = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        link.click();
    };

    const filteredData = props?.data.filter((item) => {
        const fileName = item?.file?.name || "";
        const dotIndex = fileName.lastIndexOf(".");
        const fileExtension = dotIndex !== -1 ? fileName.slice(dotIndex + 1) : "";

        switch (activeTab) {
            case 'all':
                return true;
            case 'document':
                return ['pdf', 'docx', 'pptx', 'xlsx'].includes(fileExtension.toLowerCase());
            case 'audio':
                return ['mp3'].includes(fileExtension.toLowerCase());
            case 'picture':
                return ['jpg', 'png', 'bmp'].includes(fileExtension.toLowerCase());
            case 'video':
                return ['mp4'].includes(fileExtension.toLowerCase());
            default:
                return true;
        }
    });

    return (
        <div className='OrgAudioMain'>
            <div className='row'>
                <div className='col-lg-10 col-md-12 col-sm-12'>
                    <div className='ReviwsandFeedbackTabs mt-5'>
                        <ul class="row nav nav-pills mb-3 w-100 gx-4"
                            id="pills-tab"
                            role="tablist" >
                            <li
                                style={{
                                    borderRight: activeTab ? "1px solid #00000030" : "",
                                }}
                                className="nav-item col-lg-2 col-sm-12 col-" role="presentation">
                                <button
                                    className={`nav-link w-100 ${activeTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('all')}
                                >
                                    All
                                </button>
                            </li>
                            <li style={{
                                borderRight: activeTab ? "1px solid #00000030" : "",
                            }} className="nav-item col-lg-2 col-sm-12 col-" role="presentation">
                                <button
                                    className={`nav-link w-100 ${activeTab === 'document' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('document')}
                                >
                                    Document
                                </button>
                            </li>
                            <li style={{
                                borderRight: activeTab ? "1px solid #00000030" : "",
                            }}
                                className="nav-item col-lg-2 col-sm-12 col-" role="presentation">
                                <button
                                    className={`nav-link w-100 ${activeTab === 'audio' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('audio')}
                                >
                                    Audio
                                </button>
                            </li>
                            <li
                                style={{
                                    borderRight: activeTab ? "1px solid #00000030" : "",
                                }}
                                className="nav-item col-lg-2 col-sm-12 col-" role="presentation">
                                <button
                                    className={`nav-link w-100 ${activeTab === 'picture' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('picture')}
                                >
                                    Picture
                                </button>
                            </li>
                            <li
                                style={{
                                    borderRight: activeTab ? "1px solid #00000030" : "",
                                }}
                                className="nav-item col-lg-2 col-sm-12 col-" role="presentation">
                                <button
                                    className={`nav-link w-100 ${activeTab === 'video' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('video')}
                                >
                                    Video
                                </button>
                            </li>
                        </ul>

                    </div>

                </div>
            </div>
            <div className="row">
                {filteredData.map((item) => {
                    const fileName = item?.file?.name || "";
                    const dotIndex = fileName.lastIndexOf(".");
                    const fileExtension = dotIndex !== -1 ? fileName.slice(dotIndex + 1) : "";

                    // Determine the image source based on the file extension
                    const imageSource = extensionToImage[fileExtension.toLowerCase()];

                    // Limit description text to 40 words
                    const description = item?.description || "";
                    const words = description.split(' ');
                    const trimmedDescription = words.length > 19 ? words.slice(0, 19).join(' ') + ' ...' : words.join(' ');

                    return (
                        <div className="col-md-6 col-lg-4 col-xl-3 mt-5" key={item.id}>
                            <div className='AudioCard pointer' onClick={() => handleDownload(item?.file?.url, fileName)}>
                                <div className='OrgAudio row align-items-center'>
                                    <div className='col-md-2'>
                                        {imageSource && (
                                            <img style={{ width: 40, height: 40 }} src={imageSource} alt={`Image for ${fileExtension}`} />
                                        )}
                                    </div>
                                    <div className='col-md-10'>
                                        <p className='title'>{fileName}</p>
                                    </div>
                                </div>
                                <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} />
                                <div className='orgAudioDesc mt-2'>
                                    <p>{trimmedDescription}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrgAudio;
