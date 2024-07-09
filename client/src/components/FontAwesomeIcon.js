// FontAwesomeIcon.js

import React from 'react';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';

const FontAwesomeIcon = ({ icon, className, ...rest }) => {
  return <FAIcon icon={icon} className={className} {...rest} />;
};

export default FontAwesomeIcon;
