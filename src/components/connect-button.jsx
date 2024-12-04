import React from 'react';

const ConnectButton = () => {
  return (
    <button
      onClick={() => {
        console.log('Connect button clicked');
      }}
    >
      Connect
    </button>
  );
};

export default ConnectButton;
