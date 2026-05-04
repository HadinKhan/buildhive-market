import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../components/Icons";

import {
  sendContactMessage,
  ContactFormData,
  validateContactForm,
} from "../src/services/contactService";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const contactPageStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; }

.contact-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #0a0a0f;
  color: #e2e8f0;
  line-height: 1.6;
  overflow-x: hidden;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes floatReverse {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(15px) rotate(-2deg); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes meshMove {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes meshMove2 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 20px) scale(1.05); }
  66% { transform: translate(20px, -40px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes diagonalSlide {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
}

@keyframes wave {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  75% { transform: translateY(5px); }
}

@keyframes borderGlow {
  0%, 100% { border-color: rgba(139, 92, 246, 0.3); }
  50% { border-color: rgba(139, 92, 246, 0.8); }
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

.reveal-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-left.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-right.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-scale {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-scale.active {
  opacity: 1;
  transform: scale(1);
}

.stagger-1 { transition-delay: 0.1s; }
.stagger-2 { transition-delay: 0.2s; }
.stagger-3 { transition-delay: 0.3s; }
.stagger-4 { transition-delay: 0.4s; }
.stagger-5 { transition-delay: 0.5s; }

.hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 140px 20px 100px;
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0818 50%, #0a0a0f 100%);
  position: relative;
  overflow: hidden;
}

.mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.4;
}

.mesh-blob-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%);
  top: -200px;
  right: -100px;
  animation: meshMove 12s ease-in-out infinite;
}

.mesh-blob-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%);
  bottom: -150px;
  left: -100px;
  animation: meshMove2 15s ease-in-out infinite;
}

.mesh-blob-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent 70%);
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  animation: meshMove 18s ease-in-out infinite reverse;
}

.diagonal-strip {
  position: absolute;
  width: 150%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1), transparent);
  transform: rotate(-35deg);
  pointer-events: none;
}

.diagonal-strip-1 { top: 20%; left: -25%; animation: diagonalSlide 8s linear infinite; }
.diagonal-strip-2 { top: 40%; left: -25%; animation: diagonalSlide 10s linear infinite 2s; }
.diagonal-strip-3 { top: 60%; left: -25%; animation: diagonalSlide 12s linear infinite 4s; }
.diagonal-strip-4 { top: 80%; left: -25%; animation: diagonalSlide 9s linear infinite 1s; }

.geo-shape {
  position: absolute;
  pointer-events: none;
  opacity: 0.08;
}

.geo-hex {
  width: 120px;
  height: 120px;
  top: 15%;
  left: 10%;
  animation: float 10s ease-in-out infinite;
}

.geo-hex svg,
.geo-triangle svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke-width: 1;
}

.geo-hex svg { stroke: #a78bfa; }

.geo-circle {
  width: 80px;
  height: 80px;
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 50%;
  top: 60%;
  right: 15%;
  animation: floatReverse 8s ease-in-out infinite;
}

.geo-square {
  width: 60px;
  height: 60px;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 12px;
  bottom: 20%;
  left: 20%;
  animation: spinSlow 25s linear infinite;
}

.geo-triangle {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 8%;
  animation: float 12s ease-in-out infinite 3s;
}

.geo-triangle svg { stroke: rgba(168, 85, 247, 0.15); }

.dot-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(139, 92, 246, 0.12) 1px, transparent 1px);
  background-size: 30px 30px;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
}

.ripple-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ripple-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  animation: ripple 6s ease-out infinite;
}

.ripple-ring:nth-child(2) { animation-delay: 2s; }
.ripple-ring:nth-child(3) { animation-delay: 4s; }

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-badge {
  display: inline-block;
  padding: 0 0 5px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid rgba(139, 92, 246, 0.45);
  color: #d9ccff;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 32px;
}

.hero-badge-dot {
  display: none;
}

.hero h1 {
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 24px;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c4b5fd 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 6s ease infinite;
}

.hero p {
  font-size: 1.15rem;
  color: #94a3b8;
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.75;
}

.contact-pills {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 40px;
  flex-wrap: wrap;
}

.contact-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
}

.contact-pill:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  transform: translateY(-3px);
}

.contact-pill svg,
.social-link svg,
.submit-btn svg,
.map-card-icon svg,
.btn-primary svg,
.btn-secondary svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.contact-section {
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: start;
}

.contact-info h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.contact-info > p {
  color: #94a3b8;
  margin-bottom: 40px;
  line-height: 1.7;
  font-size: 1.05rem;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(139, 92, 246, 0.25);
  transform: translateX(8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.info-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.info-card:hover .info-icon {
  transform: scale(1.1) rotate(-5deg);
}

.info-icon svg { width: 26px; height: 26px; color: white; }
.info-icon.purple { background: linear-gradient(135deg, #a78bfa, #7c3aed); }
.info-icon.blue { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.info-icon.green { background: linear-gradient(135deg, #34d399, #10b981); }
.info-icon.amber { background: linear-gradient(135deg, #fbbf24, #f59e0b); }

.info-content h3 {
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.info-content p {
  color: #94a3b8;
  font-size: 15px;
  line-height: 1.6;
}

.info-content a {
  color: #a78bfa;
  text-decoration: none;
}

.info-content a:hover { color: #c4b5fd; }

.social-section { margin-top: 40px; }

.social-section h3 {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.social-link:hover {
  background: #7c3aed;
  color: white;
  border-color: #7c3aed;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.form-container {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.form-container::before {
  content: '';
  position: absolute;
  top: -200px;
  right: -200px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.06), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.form-header {
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.form-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.form-header p { color: #94a3b8; font-size: 15px; }

.form-group {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-label {
  display: block;
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
}

.form-input::placeholder,
.form-textarea::placeholder { color: #475569; }

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.form-textarea {
  min-height: 140px;
  resize: vertical;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 18px;
}

.form-select option { background: #0f0a1a; color: white; }

.submit-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 54px;
  padding: 0 28px;
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  border: 1px solid rgba(167, 139, 250, 0.44);
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
}

.submit-btn::before {
  display: none;
}

.submit-btn:hover::before { display: none; }

.submit-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: #211830;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.submit-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.feedback {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  margin-bottom: 18px;
}

.feedback.success {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
}

.feedback.error {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}

.faq-section {
  padding: 100px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.faq-section .section-header { text-align: center; margin-bottom: 60px; }

.section-label {
  display: inline-block;
  padding: 0 0 5px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid rgba(139, 92, 246, 0.45);
  color: #d9ccff;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.faq-list { display: flex; flex-direction: column; gap: 16px; }

.faq-item {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-item:hover { border-color: rgba(139, 92, 246, 0.15); }

.faq-item.expanded {
  border-color: rgba(139, 92, 246, 0.25);
  background: rgba(255, 255, 255, 0.03);
}

.faq-question {
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-question h3 {
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  padding-right: 20px;
}

.faq-item.expanded .faq-question h3 { color: #a78bfa; }

.faq-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-icon svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  opacity: 1;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-chevron {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  opacity: 1;
  pointer-events: none;
}

.faq-item.expanded .faq-icon {
  background: #7c3aed;
  border-color: #7c3aed;
  color: white;
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-item.expanded .faq-answer { max-height: 300px; }

.faq-answer p {
  padding: 0 28px 24px;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 15px;
}

.map-section {
  padding: 0 20px 100px;
  max-width: 1200px;
  margin: 0 auto;
}

.map-container {
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.map-container iframe {
  width: 100%;
  height: 450px;
  border: none;
  filter: grayscale(100%) invert(92%) contrast(83%);
}

.map-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  background: linear-gradient(to top, rgba(10, 10, 15, 0.95), transparent);
}

.map-card {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: rgba(15, 15, 25, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 28px;
}

.map-card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.map-card-content h4 {
  color: white;
  font-weight: 700;
  margin-bottom: 2px;
}

.map-card-content p {
  color: #94a3b8;
  font-size: 14px;
}

.cta-section {
  padding: 100px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 58, 237, 0.1), transparent), linear-gradient(to bottom, transparent, rgba(124, 58, 237, 0.03));
}

.cta-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.cta-section h2 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
}

.cta-section p {
  color: #94a3b8;
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto 32px;
  line-height: 1.75;
  position: relative;
  z-index: 1;
}

.btn-primary,
.btn-secondary {
  position: relative;
  overflow: hidden;
  min-height: 54px;
  padding: 0 30px;
  color: #f5f3ff;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  border: 1px solid rgba(167, 139, 250, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(124, 58, 237, 0.22);
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 14px;
  background: radial-gradient(circle at 30% 0%, rgba(196, 181, 253, 0.18), transparent 36%);
  pointer-events: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #211830;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.025);
  color: #e9d5ff;
  border: 1px solid rgba(167, 139, 250, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.055);
  color: #ffffff;
  transform: translateY(-2px);
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 16px 34px rgba(0, 0, 0, 0.24);
}

@media (max-width: 1024px) {
  .contact-grid { grid-template-columns: 1fr; gap: 50px; }
  .form-container { padding: 36px; }
}

@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr; }
  .form-container { padding: 28px; }
  .info-card:hover { transform: translateX(4px); }
  .map-container iframe { height: 350px; }
  .faq-question { padding: 20px 22px; }
  .faq-answer p { padding: 0 22px 20px; }
  .geo-hex, .geo-circle, .geo-square, .geo-triangle { display: none; }
}

.contact-root ::-webkit-scrollbar { width: 8px; }
.contact-root ::-webkit-scrollbar-track { background: #0a0a0f; }
.contact-root ::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 4px; }
.contact-root ::-webkit-scrollbar-thumb:hover { background: #6d28d9; }
`;

const faqItems = [
  {
    q: "What is BuildHive and who is it for?",
    a: "BuildHive is a digital marketplace specifically designed for Pakistan's construction industry. It serves architects, engineers, contractors, interior designers, and suppliers who want to buy, sell, or collaborate on construction projects. Whether you're looking for quality materials, professional services, or AI-powered project assistance, BuildHive provides a unified platform to meet your needs.",
  },
  {
    q: "How does the AI Recommendation System work?",
    a: "Our AI Material Recommendation System analyzes your project specifications, budget constraints, and quality requirements to suggest optimal construction materials and services. Simply input your project details, and the system generates ranked recommendations with detailed explanations. You can also request variations, compare options, and save results for future reference.",
  },
  {
    q: "Is BuildHive secure for transactions and data?",
    a: "Absolutely. BuildHive implements industry-standard security measures including password hashing, data encryption in transit and at rest, role-based access control, and secure payment gateway integration. We do not store raw credit card information—all payments are processed through established third-party gateways using secure tokens. Your data privacy and transaction security are our top priorities.",
  },
  {
    q: "What are the different user roles on BuildHive?",
    a: "BuildHive offers four main roles: Buyers can browse, purchase, and review construction resources; Sellers can list products, manage inventory, and track sales performance; Service Providers (Freelancers) can offer specialized services, submit proposals, and manage client projects; and Admins oversee platform operations, moderate content, and resolve disputes. You select your role during registration and can access role-specific dashboards.",
  },
  {
    q: "How can I get support if I encounter issues?",
    a: "We offer multiple support channels: our AI Chatbot provides instant 24/7 assistance for common queries; you can contact our support team via email at support@buildhive.pk with a 24-hour response time; and our comprehensive documentation covers platform features and troubleshooting. For urgent matters, our team is available Monday through Friday, 9 AM to 6 PM PST.",
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate: _onNavigate }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealNodes = root.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    revealNodes.forEach((node) => observer.observe(node));

    const heroReveals = root.querySelectorAll<HTMLElement>(".hero .reveal");
    const timers: number[] = [];
    heroReveals.forEach((el, index) => {
      const id = window.setTimeout(() => {
        el.classList.add("active");
      }, 200 + index * 150);
      timers.push(id);
    });

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const payload: ContactFormData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    };

    const validationError = validateContactForm(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage(payload);
      setSuccess("Message sent! Our team will contact you shortly.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={rootRef} className="contact-root">
      <style>{contactPageStyles}</style>

      <section className="hero">
        <div className="mesh-blob mesh-blob-1"></div>
        <div className="mesh-blob mesh-blob-2"></div>
        <div className="mesh-blob mesh-blob-3"></div>

        <div className="diagonal-strip diagonal-strip-1"></div>
        <div className="diagonal-strip diagonal-strip-2"></div>
        <div className="diagonal-strip diagonal-strip-3"></div>
        <div className="diagonal-strip diagonal-strip-4"></div>

        <div className="dot-pattern"></div>

        <div className="geo-shape geo-hex">
          <svg viewBox="0 0 100 100">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
          </svg>
        </div>
        <div className="geo-shape geo-circle"></div>
        <div className="geo-shape geo-square"></div>
        <div className="geo-shape geo-triangle">
          <svg viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" />
          </svg>
        </div>

        <div className="ripple-container">
          <div className="ripple-ring"></div>
          <div className="ripple-ring"></div>
          <div className="ripple-ring"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="hero-badge-dot"></span>
            Get In Touch
          </div>

          <h1 className="reveal stagger-1">
            Let's Start a
            <br />
            <span className="gradient-text">Conversation</span>
          </h1>

          <p className="reveal stagger-2">
            Have a question, partnership idea, or just want to say hello? We'd
            love to hear from you. Our team is ready to help.
          </p>

          <div className="contact-pills reveal stagger-3">
            <a href="tel:+923001234567" className="contact-pill">
              <Icons.Phone />
              +92 300 1234567
            </a>
            <a href="mailto:support@buildhive.pk" className="contact-pill">
              <Icons.Mail />
              support@buildhive.pk
            </a>
            <span className="contact-pill">
              <Icons.Clock />
              AI Chatbot Available
            </span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          <div className="contact-info reveal-left">
            <h2>Contact Information</h2>
            <p>
              Fill out the form and our team will get back to you within 24
              hours. Or reach out directly using the information below.
            </p>

            <div className="info-cards">
              <div className="info-card reveal stagger-1">
                <div className="info-icon purple">
                  <Icons.Phone />
                </div>
                <div className="info-content">
                  <h3>Phone</h3>
                  <p>
                    <a href="tel:+923001234567">+92 300 1234567</a>
                  </p>
                  <p style={{ fontSize: "13px", marginTop: "4px" }}>
                    Mon - Fri, 9am - 6pm PST
                  </p>
                </div>
              </div>

              <div className="info-card reveal stagger-2">
                <div className="info-icon blue">
                  <Icons.Mail />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:support@buildhive.pk">support@buildhive.pk</a>
                  </p>
                  <p style={{ fontSize: "13px", marginTop: "4px" }}>
                    We reply within 24 hours
                  </p>
                </div>
              </div>

              <div className="info-card reveal stagger-3">
                <div className="info-icon green">
                  <Icons.MapPin />
                </div>
                <div className="info-content">
                  <h3>Office</h3>
                  <p>Department of Computer Science, COMSATS University Islamabad, Lahore Campus</p>
                  <p>Defence Road, Lahore, Pakistan</p>
                  <p style={{ fontSize: "13px", marginTop: "4px" }}>Visit by appointment only</p>
                </div>
              </div>

              <div className="info-card reveal stagger-4">
                <div className="info-icon amber">
                  <Icons.Users />
                </div>
                <div className="info-content">
                  <h3>Academic Supervisor</h3>
                  <p>Mr. Usman Akram</p>
                  <p>Assistant Professor, Computer Science, CUI Lahore</p>
                </div>
              </div>

              <div className="info-card reveal stagger-5">
                <div className="info-icon purple">
                  <Icons.Briefcase />
                </div>
                <div className="info-content">
                  <h3>Industrial Mentor</h3>
                  <p>Cubic Solutions Inc.</p>
                  <p>Contact: Via university coordination</p>
                </div>
              </div>
            </div>

            <div className="social-section reveal stagger-5">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Icons.Facebook />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Icons.Twitter />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <Icons.Linkedin />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Icons.Instagram />
                </a>
              </div>
            </div>
          </div>

          <div className="form-container reveal-right">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you shortly.</p>
            </div>

            {success && <div className="feedback success">{success}</div>}
            {error && <div className="feedback error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="form-select"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
                <Icons.ArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="map-container reveal">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435521.4079057554!2d74.07102855!3d31.482635849999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1704067200000!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BuildHive Map"
          ></iframe>
          <div className="map-overlay">
            <div className="map-card">
              <div className="map-card-icon">
                <Icons.MapPin />
              </div>
              <div className="map-card-content">
                <h4>COMSATS Lahore Campus</h4>
                <p>Department of Computer Science, Defence Road, Lahore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-header reveal">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div
              key={item.q}
              className={`faq-item ${
                activeFaq === index ? "expanded" : ""
              }`}
            >
              <div
                className="faq-question"
                onClick={() =>
                  setActiveFaq((prev) => (prev === index ? null : index))
                }
              >
                <h3>{item.q}</h3>
                <div className="faq-icon">
                  <Icons.ChevronDown className="faq-chevron" />
                </div>
              </div>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
