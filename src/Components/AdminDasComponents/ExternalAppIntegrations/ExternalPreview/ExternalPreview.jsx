import {useContext} from 'react';
import AuthContext from '../../../../Store/Auth-Context.jsx';


const ExternalPreview = (props) => {
  const authCtx = useContext(AuthContext);
  const { nodeData, apiUrl } = props;
    
  return (
    <div>
      <h1>External Preview</h1>
    </div>
  );
};

export default ExternalPreview;