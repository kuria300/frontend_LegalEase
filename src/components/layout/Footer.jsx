import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
     <footer className="footer-container">
        <div className="footer-position">
          <div className="col-span-1 md:col-span-2">
            <span className="font-bold mb-4 block">LegalEase</span>
            <p className="opacity-70 max-w-lg tracking-wider">Empowering Kenyans with accessible legal information and professional counsel. Making the law understandable for everyone.</p>
          </div>

          <div>
            <h4 className="mb-2 uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-4 opacity-70">
              <li><Link to="/find-lawyers" className="footer-links">Find a Lawyer</Link></li>
              <li><a className="footer-links" href="/legal-resources">Legal Resources</a></li>
              <li><a className="footer-links" href="/pricing">Pricing</a></li>
              <li><Link to="/about" className="footer-links">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 uppercase tracking-wider">Legal</h4>
            <ul className="flex flex-col gap-4 opacity-70">
              <li><a className="footer-links" href="/privacy">Privacy Policy</a></li>
              <li><a className="footer-links" href="/terms">Terms of Service</a></li>
              <li><a className="footer-links" href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-year_section">
          <p className="opacity-50 font-medium">
            © {new Date().getFullYear()} LegalEase Kenya. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;