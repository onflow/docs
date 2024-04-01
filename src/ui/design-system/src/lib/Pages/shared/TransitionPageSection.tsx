import React, { useEffect, useRef, useState } from 'react';
import PageSection, { type PageSectionProps } from './PageSection';

const Section = ({
  className,
  children,
  sectionId,
}: PageSectionProps): React.ReactNode => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3, // Trigger when 10% of the section is visible
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Tailwind classes for styling
  const sectionClasses = `transition-opacity duration-500 ease-out ${
    isVisible ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <div ref={sectionRef} className={sectionClasses}>
      <PageSection sectionId={sectionId} className={className}>
        {children}
      </PageSection>
    </div>
  );
};

export default Section;
