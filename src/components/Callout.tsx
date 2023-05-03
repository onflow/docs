import React from 'react';

export const Callout = (props: React.PropsWithChildren): JSX.Element => (
  <div>{props.children}</div>
);

export default Callout;
