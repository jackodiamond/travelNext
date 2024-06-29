'use client';

import Link from 'next/link';
import PropTypes from 'prop-types';

const NavButton = ({ path, label, className }) => {
  return (
    <Link href={path} className={`${className}`}>
      {label}
    </Link>
  );
};

NavButton.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

NavButton.defaultProps = {
  className: '',
};

export default NavButton;
