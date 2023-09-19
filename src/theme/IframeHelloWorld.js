import React, { useEffect } from 'react';

export default function IframeHelloWorld() {
  useEffect(() => {
    const iframe = document.querySelector('.flow-runner-iframe');

    // Make sure the iframe is loaded
    iframe.addEventListener('load', function () {
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      // Find the cadence-container div inside the iframe
      const cadenceContainer =
        iframeDocument.querySelector('.cadence-container');

      // Set its height to 200px
      if (cadenceContainer) {
        cadenceContainer.style.height = '200px';
      }
    });
  }, []);

  return (
    <>
      <iframe
        className="flow-runner-iframe"
        src="https://runflow.pratikpatel.io/"
        width="100%"
        height="400px"
      ></iframe>
    </>
  );
}
