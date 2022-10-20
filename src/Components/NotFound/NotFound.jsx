import { Button } from '@carbon/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { gridContainer, image, link, title } from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className='mainContainer' >
      <div className={gridContainer}>
        <div>
          <img className={image} src='https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg' alt='Page not found' />
          <h2 className={title}>Something is not right...</h2>
          <p>
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </p>
          <Link className={link} to='/link-manager'> <Button size='md' kind='primary'> Get back to home page </Button></Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;