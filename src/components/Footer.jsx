import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer-fixed">
      <div className="footer-content">
        <span>v1.0</span>
        <span className="divisor">|</span>
        <span>Dev: <strong>Richard Roque</strong></span>
        <span className="divisor">|</span>
        <a 
            href="https://wa.me/5516993437724" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
        >
            📱 (16) 99343-7724
        </a>
      </div>
    </footer>
  )
}

export default Footer