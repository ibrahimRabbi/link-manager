import { Button } from 'rsuite';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';

const { gridContainer, image, title } = styles;

const NotFound = () => {
  const { isWbe } = useSelector((state) => state.links);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    isWbe ? navigate('/wbe') : navigate('/');
  };
  return (
    <div className="mainContainer">
      <div className={gridContainer}>
        <div>
          <img
            className={image}
            src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg"
            alt="Page not found"
          />
          <h2 className={title}>Something is not right...</h2>
          <p>
            Page you are trying to open does not exist. You may have mistyped the address,
            or the page has been moved to another URL. If you think this is an error
            contact support.
          </p>
          <Button
            style={{ width: '300px' }}
            color="blue"
            appearance="primary"
            onClick={handleBackToHome}
          >
            Get back to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
