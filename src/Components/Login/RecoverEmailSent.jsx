import React from 'react';
import style from './Login.module.scss';
import { useSelector } from 'react-redux';
import { Button } from 'rsuite';
import { useNavigate } from 'react-router-dom';
const { title, logoContainer, sendEmailMess, backLoginBtn } = style;

const RecoverEmailSent = () => {
  const { isDark } = useSelector((state) => state.nav);
  const navigate = useNavigate();
  return (
    <div style={{ margin: '0 auto', width: '600px' }}>
      <div className={logoContainer} style={{ paddingTop: '50px' }}>
        <img
          src={window.location.origin + '/traceLynx_logo.svg'}
          height={30}
          alt="TL_logo"
        />
        <h2 className={title}>
          <span
            style={{
              color: isDark === 'dark' ? '#3491e2' : '#2c74b3',
            }}
          >
            Trace
          </span>
          <span
            style={{
              color: isDark === 'dark' ? '#1d69ba' : '#144272',
            }}
          >
            Lynx
          </span>
        </h2>
      </div>

      <h5 className={sendEmailMess}>
        If the email is registered, then an email will arrive in the inbox.
      </h5>

      <div className={backLoginBtn}>
        <Button appearance="link" onClick={() => navigate('/login')}>
          Back to Sign in
        </Button>
      </div>
    </div>
  );
};

export default RecoverEmailSent;
