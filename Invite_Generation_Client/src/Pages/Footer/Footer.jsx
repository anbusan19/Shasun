import React from 'react';

const Footer = () => {
  // Common colors and spacing
  const backgroundColor = '#131A22'; // Dark navy-like color
  const textColor = '#fff';          // White text
  const linkColor = '#fff';          // White links
  const headingMargin = '0 0 1rem 0';

  return (
    <div
      style={{
        width: '100%',
        backgroundColor,
        color: textColor,
        marginTop: '2rem',
        paddingTop: '2rem',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Top container for 4 columns */}
      <div
        style={{
          width: '80%',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingBottom: '2rem'
        }}
      >
        {/* Quick Link Column */}
        <div style={{ flex: '1 1 200px', marginBottom: '1rem' }}>
          <h4 style={{ margin: headingMargin }}>Quick Link</h4>
          <a 
            href="#about" 
            style={{ 
              display: 'block', 
              color: linkColor, 
              textDecoration: 'none', 
              marginBottom: '0.4rem' 
            }}
          >
            About Us
          </a>
          <a 
            href="#contact" 
            style={{ 
              display: 'block', 
              color: linkColor, 
              textDecoration: 'none', 
              marginBottom: '0.4rem' 
            }}
          >
            Contact Us
          </a>
          <a 
            href="#privacy" 
            style={{ 
              display: 'block', 
              color: linkColor, 
              textDecoration: 'none', 
              marginBottom: '0.4rem' 
            }}
          >
            Privacy Policy
          </a>
          <a 
            href="#terms" 
            style={{ 
              display: 'block', 
              color: linkColor, 
              textDecoration: 'none', 
              marginBottom: '0.4rem' 
            }}
          >
            Terms &amp; Condition
          </a>
          <a 
            href="#faqs" 
            style={{ 
              display: 'block', 
              color: linkColor, 
              textDecoration: 'none'
            }}
          >
            FAQs &amp; Help
          </a>
        </div>

        {/* Contact Column */}
        <div style={{ flex: '1 1 200px', marginBottom: '1rem' }}>
          <h4 style={{ margin: headingMargin }}>Contact</h4>
          <p style={{ marginBottom: '0.5rem' }}>
            Bus Stand, No: 3, Madley Rd, near T.Nagar,<br />
            T. Nagar, Chennai, Tamil Nadu 600017
          </p>
          <p style={{ marginBottom: '0.5rem' }}>044 2432 8507</p>
          <p style={{ marginBottom: '1rem' }}>shasuncollege.edu.in</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Social Icons - placeholders */}
            <a 
              href="#twitter"
              style={{
                display: 'inline-block',
                border: '1px solid #fff',
                padding: '0.4rem',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              T
            </a>
            <a 
              href="#facebook"
              style={{
                display: 'inline-block',
                border: '1px solid #fff',
                padding: '0.4rem',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              F
            </a>
            <a 
              href="#youtube"
              style={{
                display: 'inline-block',
                border: '1px solid #fff',
                padding: '0.4rem',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              Y
            </a>
            <a 
              href="#linkedin"
              style={{
                display: 'inline-block',
                border: '1px solid #fff',
                padding: '0.4rem',
                color: '#fff',
                textDecoration: 'none'
              }}
            >
              L
            </a>
          </div>
        </div>

        {/* Gallery Column */}
        <div style={{ flex: '1 1 200px', marginBottom: '1rem' }}>
          <h4 style={{ margin: headingMargin }}>Gallery</h4>
          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}
          >
            {/* Example "dots" or placeholders */}
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff' }}></div>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff' }}></div>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff' }}></div>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff' }}></div>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff' }}></div>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#fff' }}></div>
          </div>
        </div>

        {/* Newsletter Column */}
        <div style={{ flex: '1 1 200px', marginBottom: '1rem' }}>
          <h4 style={{ margin: headingMargin }}>Newsletter</h4>
          <p style={{ marginBottom: '1rem' }}>
            Stay updated with our latest news and events.
          </p>
          <div 
            style={{
              position: 'relative',
              maxWidth: '300px',
              margin: '0 auto'
            }}
          >
            <input
              type="text"
              placeholder="Your email"
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '0.5rem'
              }}
            />
            <button
              type="button"
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              SignUp
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ width: '80%', margin: '0 auto', padding: '1rem 0', borderTop: '1px solid #555' }}>
        <div 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            &copy;{' '}
            <a 
              href="https://shasuncollege.edu.in/" 
              style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid transparent' }}
            >
              shasuncollege.edu.in
            </a>, 
            All Right Reserved.
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <a 
              href="#home" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                marginRight: '1rem' 
              }}
            >
              Home
            </a>
            <a 
              href="#cookies" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                marginRight: '1rem' 
              }}
            >
              Cookies
            </a>
            <a 
              href="#help" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                marginRight: '1rem' 
              }}
            >
              Help
            </a>
            <a 
              href="#faqs" 
              style={{ 
                color: '#fff', 
                textDecoration: 'none'
              }}
            >
              FQAs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
