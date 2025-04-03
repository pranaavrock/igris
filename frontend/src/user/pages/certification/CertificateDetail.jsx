// CertificateDetail.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiDownload, 
  FiPrinter, 
  FiShare2, 
  FiAward, 
  FiClock, 
  FiUser, 
  FiArrowLeft 
} from 'react-icons/fi';
import styled from 'styled-components';

const CertificateDetail = () => {
  const { certId } = useParams();
  const navigate = useNavigate();
  const [isShared, setIsShared] = useState(false);

  // Sample data - in a real app, fetch from API using certId
  const certification = {
    id: certId,
    courseName: 'Advanced React Development',
    studentName: 'John Doe',
    completionDate: 'June 15, 2023',
    instructor: 'Jane Smith',
    duration: '8 weeks',
    skills: [
      'React Hooks',
      'Context API',
      'Redux',
      'React Router',
      'Performance Optimization'
    ],
    verificationUrl: 'https://verify.learnhub.com'
  };

  const handleDownload = () => {
    alert(`Downloading certificate ${certId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 3000);
  };

  return (
    <CertificateDetailContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Dashboard
      </BackButton>
      
      <CertificateContainer>
        <CertificatePaper>
          <CertificateHeader>
            <FiAward className="icon" />
            <h1>Certificate of Completion</h1>
            <p>This is to certify that</p>
          </CertificateHeader>
          
          <CertificateBody>
            <h2>{certification.studentName}</h2>
            <p>has successfully completed the course</p>
            <h3>{certification.courseName}</h3>
            
            <CertificateDetails>
              <DetailItem>
                <FiClock className="icon" />
                <span>Completed on: {certification.completionDate}</span>
              </DetailItem>
              <DetailItem>
                <FiUser className="icon" />
                <span>Instructor: {certification.instructor}</span>
              </DetailItem>
            </CertificateDetails>
            
            <CertificateSkills>
              <h4>Skills Acquired:</h4>
              <ul>
                {certification.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </CertificateSkills>
          </CertificateBody>
          
          <CertificateFooter>
            <Signature>
              <div className="line" />
              <p>Director of Education</p>
            </Signature>
            <CertificateId>
              <p>Certificate ID: {certification.id}</p>
            </CertificateId>
          </CertificateFooter>
        </CertificatePaper>

        <ActionButtons>
          <ActionButton onClick={handleDownload} className="download">
            <FiDownload className="icon" />
            Download PDF
          </ActionButton>
          <ActionButton onClick={handlePrint} className="print">
            <FiPrinter className="icon" />
            Print Certificate
          </ActionButton>
          <ActionButton onClick={handleShare} className="share">
            <FiShare2 className="icon" />
            {isShared ? 'Shared!' : 'Share'}
          </ActionButton>
        </ActionButtons>

        <CertificateInfo>
          <h3>About This Certificate</h3>
          <p>
            This certificate verifies that {certification.studentName} has successfully completed 
            all requirements for the {certification.courseName} course.
          </p>
          
          <h3>Verification</h3>
          <p>
            Verify this certificate at: <a href={certification.verificationUrl}>{certification.verificationUrl}</a>
          </p>
        </CertificateInfo>
      </CertificateContainer>
    </CertificateDetailContainer>
  );
};

// Styled Components (scoped to this component only)
const CertificateDetailContainer = styled.div`
  font-family: 'Segoe UI', Roboto, sans-serif;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #333;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #1a73e8;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  .icon {
    font-size: 1.2rem;
  }
`;

const CertificateContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 0 auto;
  max-width: 900px;
`;

const CertificatePaper = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  border: 2px solid #f1f1f1;
  padding: 2rem;
  background-color: #fff;
  position: relative;
`;

const CertificateHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #2d3748;
    margin: 1rem 0 0.5rem;
  }

  p {
    color: #6b7280;
  }

  .icon {
    font-size: 3rem;
    color: #f59e0b;
  }
`;

const CertificateBody = styled.div`
  margin: 2rem 0;

  h2 {
    font-size: 1.8rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.4rem;
    color: #1a73e8;
    margin: 1rem 0;
  }
`;

const CertificateDetails = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;

  .icon {
    color: #1a73e8;
  }
`;

const CertificateSkills = styled.div`
  margin: 2rem auto;
  max-width: 600px;
  text-align: left;

  h4 {
    font-size: 1.1rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
    padding-left: 1.5rem;
  }
`;

const CertificateFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 3rem;
`;

const Signature = styled.div`
  text-align: center;

  .line {
    width: 200px;
    height: 1px;
    background-color: #334155;
    margin: 0 auto 0.5rem;
  }

  p {
    font-size: 0.9rem;
  }
`;

const CertificateId = styled.div`
  font-size: 0.9rem;
  color: #64748b;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &.download {
    background: #1a73e8;
    color: white;

    &:hover {
      background: #1765cc;
    }
  }

  &.print {
    background: #e0e7ff;
    color: #1a73e8;

    &:hover {
      background: #c7d2fe;
    }
  }

  &.share {
    background: #f0f9ff;
    color: #0369a1;

    &:hover {
      background: #e0f2fe;
    }
  }

  .icon {
    font-size: 1.2rem;
  }
`;

const CertificateInfo = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;

  h3 {
    color: #1e293b;
    margin: 1.5rem 0 1rem;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  a {
    color: #1a73e8;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Print styles
const PrintStyles = styled.div`
  @media print {
    ${BackButton}, ${ActionButtons} {
      display: none;
    }
    
    ${CertificateContainer} {
      padding: 0;
      box-shadow: none;
    }
  }
`;

export default CertificateDetail;