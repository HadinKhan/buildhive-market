import React from "react";
import { privacyPageData } from "../src/data/privacyPageData";
import { legalPageStyles } from "../src/styles/legalPageStyles";

export const PrivacyPage = () => {
  return (
    <div className="legal-root">
      <style>{legalPageStyles}</style>

      <div className="legal-shell">
        <span className="legal-badge">{privacyPageData.badge}</span>
        <h1 className="legal-title">{privacyPageData.title}</h1>
        <p className="legal-subtitle">{privacyPageData.subtitle}</p>

        <div className="legal-sections">
          {privacyPageData.sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.subSections?.map((subSection) => (
                <div key={subSection.heading}>
                  <h3>{subSection.heading}</h3>
                  <ul>
                    {subSection.listItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {section.listItems && (
                <ul>
                  {section.listItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.heading === "10. Contact Us" && (
                <p className="legal-contact">
                  Email: {privacyPageData.contact.email}
                  <br />
                  Phone: {privacyPageData.contact.phone}
                  <br />
                  Address: {privacyPageData.contact.address}
                </p>
              )}
            </section>
          ))}
        </div>

        <p className="legal-updated">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};
