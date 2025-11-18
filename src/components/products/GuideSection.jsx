import React, { useState } from 'react';
import './GuideSection.css';

// Import guide images
import khungSatHopImg from '../../assets/images/khung_sat_hop.jpg';
import lapTamImg from '../../assets/images/lap_tam.jpg';
import vachHoanThienImg from '../../assets/images/vach_hoan_thien.jpg';

// Map image names to imported images
const imageMap = {
  'khung_sat_hop.jpg': khungSatHopImg,
  'lap_tam.jpg': lapTamImg,
  'vach_hoan_thien.jpg': vachHoanThienImg,
};

function GuideSection({ guideData }) {
  const [expandedStep, setExpandedStep] = useState(null);

  const toggleStep = (stepNumber) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  if (!guideData || !guideData.steps || guideData.steps.length === 0) {
    return null;
  }

  return (
    <section className="guide-section">
      <div className="guide-banner">
        <h2 className="guide-title">Hướng Dẫn Thi Công</h2>
      </div>

      <div className="guide-container">
        <div className="guide-steps">
          {guideData.steps.map((step, index) => (
            <div key={index} className="guide-step">
              <div
                className={`step-header ${expandedStep === step.step_number ? 'active' : ''}`}
                onClick={() => toggleStep(step.step_number)}
              >
                <div className="step-number-badge">
                  <span className="step-number">{step.step_number}</span>
                </div>
                <div className="step-title-area">
                  <h3 className="step-title">Bước {step.step_number}</h3>
                </div>
                <div className="step-toggle">
                  <svg
                    className="toggle-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              {expandedStep === step.step_number && (
                <div className="step-content">
                  {step.image_url && imageMap[step.image_url] && (
                    <div className="step-image-wrapper">
                      <img
                        src={imageMap[step.image_url]}
                        alt={`Bước ${step.step_number}`}
                        className="step-image"
                      />
                    </div>
                  )}
                  <div className="step-description">
                    <p>{step.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GuideSection;
