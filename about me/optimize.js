/**
 * Image Optimization and Performance Enhancement Script
 * Fromrayacamera - Mobile & Desktop Optimization
 */

(function() {
  'use strict';

  // Check if browser supports IntersectionObserver for lazy loading
  if ('IntersectionObserver' in window) {
    // Enhance native lazy loading with IntersectionObserver for better control
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Preload the image before it enters viewport
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.01
    });

    // Observe images with data-src attribute (for enhanced lazy loading)
    document.addEventListener('DOMContentLoaded', () => {
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    });
  }

  // Optimize AOS (Animate On Scroll) for mobile devices
  document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
      // Check if device is mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSlowConnection = navigator.connection && 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' || 
         navigator.connection.effectiveType === '3g');

      // Adjust AOS settings for mobile and slow connections
      if (isMobile || isSlowConnection) {
        AOS.init({
          duration: 600, // Faster animations on mobile
          once: true, // Animate only once to save resources
          disable: isSlowConnection ? true : false, // Disable on very slow connections
          offset: 50,
          easing: 'ease-in-out'
        });
      }
    }
  });

  // Progressive Image Loading Enhancement
  function progressiveImageLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      // Add fade-in effect when image loads
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
        
        // Handle image loading errors
        img.addEventListener('error', function() {
          this.classList.add('error');
          console.warn('Failed to load image:', this.src);
        });
      }
    });
  }

  // Touch gesture optimization for mobile
  function optimizeTouchInteraction() {
    // Prevent 300ms delay on touch devices
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', function() {}, { passive: true });
    }
    
    // Optimize scrolling performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Network-aware image loading
  function adaptToNetworkCondition() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Listen for network changes
      connection.addEventListener('change', () => {
        const effectiveType = connection.effectiveType;
        
        // Adjust quality based on connection
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          document.body.classList.add('low-bandwidth');
          console.log('Low bandwidth detected - optimizing content');
        } else {
          document.body.classList.remove('low-bandwidth');
        }
      });
      
      // Initial check
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('low-bandwidth');
      }
    }
  }

  // Prefetch critical resources
  function prefetchCriticalResources() {
    // Prefetch navigation images when hovering over links
    const navLinks = document.querySelectorAll('a[href*=".html"]');
    
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
        const url = this.href;
        // Create link prefetch
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = url;
        document.head.appendChild(prefetchLink);
      }, { once: true });
    });
  }

  // Image compression detection and warning
  function checkImageSizes() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const images = document.querySelectorAll('img[src*=".png"], img[src*=".jpg"]');
      const largeImages = [];
      
      images.forEach(img => {
        // Check natural size vs display size
        img.addEventListener('load', function() {
          const displaySize = this.width * this.height;
          const naturalSize = this.naturalWidth * this.naturalHeight;
          
          // If image is significantly larger than needed
          if (naturalSize > displaySize * 2) {
            largeImages.push({
              src: this.src,
              natural: naturalSize,
              display: displaySize
            });
          }
        });
      });
      
      // Log recommendations after page load
      window.addEventListener('load', () => {
        if (largeImages.length > 0) {
          console.group('Image Optimization Recommendations');
          console.log('The following images are larger than necessary:');
          largeImages.forEach(img => {
            console.log(`${img.src} - Natural: ${img.natural}px, Display: ${img.display}px`);
          });
          console.log('Consider resizing these images to improve load time.');
          console.groupEnd();
        }
      });
    }
  }

  // Initialize all optimizations
  function init() {
    progressiveImageLoad();
    optimizeTouchInteraction();
    adaptToNetworkCondition();
    prefetchCriticalResources();
    checkImageSizes();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Add CSS for fade-in effect
  const style = document.createElement('style');
  style.textContent = `
    img {
      transition: opacity 0.3s ease-in-out;
    }
    
    img[loading="lazy"]:not(.loaded) {
      opacity: 0;
    }
    
    img.loaded {
      opacity: 1;
    }
    
    img.error {
      opacity: 0.5;
      filter: grayscale(100%);
    }
    
    /* Low bandwidth mode - reduce animations */
    .low-bandwidth * {
      animation-duration: 0.1s !important;
      transition-duration: 0.1s !important;
    }
    
    .low-bandwidth [data-aos] {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);

})();
