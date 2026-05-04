import React from "react";
import { termsPageData } from "../src/data/termsPageData";
import { legalPageStyles } from "../src/styles/legalPageStyles";

export const TermsPage = () => {
  return (
    <div className="legal-root">
      <style>{legalPageStyles}</style>

      <div className="legal-shell">
        <span className="legal-badge">{termsPageData.badge}</span>
        <h1 className="legal-title">{termsPageData.title}</h1>
        <p className="legal-subtitle">{termsPageData.subtitle}</p>

        <div className="legal-sections">
          {termsPageData.sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.listItems && (
                <ul>
                  {section.listItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.heading === "11. Contact Information" && (
                <p className="legal-contact">
                  Email: {termsPageData.contact.email}
                  <br />
                  Phone: {termsPageData.contact.phone}
                  <br />
                  Address: {termsPageData.contact.address}
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
