import { Button } from '@carbon/react';
import React from 'react';
import { Link } from 'react-router-dom';

const style = {
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', justifyContent: 'center', gap: '4vw', padding: '3vw 0' },
    title: { fontWeight: 900, fontSize: 34, marginBottom: '2vw' },
    para: { color: 'gray' },
    btn: { width: '100%', marginTop: '30px', fontSize: '20px' },
    link: { textDecoration: 'none' },
    image: { maxWidth: '800px' },
};

const NotFound = () => {
    return (
        <div className='mainContainer' >
            <div style={style.gridContainer}>
                <div>
                    <h2 style={style.title}>Something is not right...</h2>
                    <p style={style.para}>
                        Page you are trying to open does not exist. You may have mistyped the address, or the
                        page has been moved to another URL. If you think this is an error contact support.
                    </p>
                    <Link style={style.link} to='/'> <Button kind='danger' style={style.btn}> Get back to home page </Button></Link>
                </div>
                <img style={style.image} src='https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg' alt='Page not found' />
            </div>
        </div>
    );
};

export default NotFound;