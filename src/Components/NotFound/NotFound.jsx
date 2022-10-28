import { Button } from '@carbon/react';
import React from 'react';
import { Link } from 'react-router-dom';
import style from './NotFound.module.css';

const {gridContainer, title, para, link, btn, image}=style;

const NotFound = () => {
  return (
    <div className='mainContainer' >
      <div className={gridContainer}>
        <div>
          <h2 className={title}>Something is not right...</h2>
          <p className={para}>
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </p>
          <Link className={link} to='/'> <Button kind='danger' className={btn}> Get back to home page </Button></Link>
        </div>
        <img className={image} src='https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg' alt='Page not found' />
      </div>
    </div>
  );
};

export default NotFound;