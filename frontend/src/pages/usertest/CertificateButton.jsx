import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import { server } from '../../main';

const CertificateButton = ({ user = {}, quizId = "Unknown Quiz", score = 0, courseName = "Untitled Course" }) => {
    const [loading, setLoading] = useState(false);

    const safeUser = {
        name: user.name || "Guest User",
        id: user.id || "000000",
    };

    const handleDownload = async () => {
        console.log("📤 Sending request to generate certificate...", { 
            safeUser, quizId, score, courseName 
        });

        setLoading(true);

        try {
            const response = await axios.post(
                `${server}/api/certificate/generate`,
                {
                    name: safeUser.name,
                    course: courseName,
                    date: new Date().toLocaleDateString(),
                    testScore: score,
                    userId: safeUser.id,
                    quizId: quizId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    responseType: 'blob' // Important for file download
                }
            );

            if (!response || !response.data) {
                throw new Error("Empty response received from the server.");
            }

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download', 
                `${courseName.replace(/ /g, '_')}_certificate_${safeUser.name.replace(/ /g, '_')}.pdf`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("✅ Certificate downloaded successfully!");

        } catch (error) {
            console.error("❌ Certificate download failed:", error);
            toast.error(error.response?.data?.message || "Failed to generate certificate.");
        } finally {
            setLoading(false);
        }
    };

    // Ensure minimum score is 80 for eligibility
    if (score < 20) {  
        return (
            <div className="certificate-not-eligible">
                <p>⚠️ Score 80% or higher required for certificate</p>
            </div>
        );
    }

    return (
        <button 
            onClick={handleDownload}
            disabled={loading}
            className="certificate-download-btn"
        >
            {loading ? (
                <>
                    <FaSpinner className="spinner" /> Generating...
                </>
            ) : (
                <>
                    <FaDownload /> Download Certificate
                </>
            )}
        </button>
    );
};

export default CertificateButton;
