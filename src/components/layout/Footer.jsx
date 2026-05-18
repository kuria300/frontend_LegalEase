import React from 'react'

const Footer = () => {
  return (
    <>
     <footer class="footer-container">
        <div class="footer-position">
        <div class="col-span-1 md:col-span-2">
            <span class="font-bold mb-4 block">LegalEase</span>
             <p class="opacity-70 max-w-lg tracking-wider">Empowering Kenyans with accessible legal information and professional counsel. Making the law understandable for everyone.</p>
        </div>
        <div>
        <h4 class="mb-2 uppercase tracking-wider">Quick Links</h4>
        <ul class="flex flex-col gap-4 opacity-70">
            <li><a class="footer-links" href="#">About Us</a></li>
            <li><a class="footer-links" href="#">Find a Lawyer</a></li>
            <li><a class="footer-links" href="#">Legal Resources</a></li>
            <li><a class="footer-links" href="#">Pricing</a></li>
        </ul>
        </div>
        <div>
        <h4 class="mb-2 uppercase tracking-wider">Legal</h4>
        <ul class="flex flex-col gap-4 opacity-70">
            <li><a class="footer-links" href="#">Privacy Policy</a></li>
            <li><a class="footer-links" href="#">Terms of Service</a></li>
            <li><a class="footer-links" href="#">Disclaimer</a></li>
        </ul>
        </div>
        </div>
        <div class="footer-year_section">
           <p class="opacity-50 font-medium">© {new Date().getFullYear()} LegalEase Kenya. All rights reserved.</p>
        </div>
   </footer>
  </>
  )
}

export default Footer

