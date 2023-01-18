import React, { useContext, useEffect } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphData } from '../../Redux/slices/graphSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import rootData from './rootData';
const apiURL= `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize`;

const GraphView = () => {
  const {graphData, graphLoading}=useSelector(state=>state.graph);
  const {sourceDataList}=useSelector(state=>state.links);
  const authCtx = useContext(AuthContext);
  const dispatch =useDispatch();

  useEffect(()=>{
    dispatch(handleCurrPageTitle('Graph view'));
    if(sourceDataList.uri){
      dispatch(fetchGraphData({
        url: `${apiURL}?start_node_id=${encodeURIComponent(sourceDataList?.uri)}`, 
        token:authCtx.token,
      }));
    }
  },[]);

  // console.log('graphLoading: ', graphLoading, graphData);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   setIsLoaded(true);
  //   fetch(`${apiURL}?start_node_id=${encodeURIComponent(uri)}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-type': 'application/json',
  //       'authorization': 'Bearer ' + authCtx.token,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data.data);
  //     })
  //     .finally(() => setIsLoaded(false));
  // }, []);
  
  console.log('fake data: ', rootData);
  console.log('API data: ', graphLoading, graphData);

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ReactGraph
        initialState={rootData}
        nodes={rootData.nodes}
        relationships={rootData.relationships}
        width="100%"
        height="100%"
        hasLegends
        hasInspector
        hasTruncatedFields
      />
    </div>
  );
};

export default GraphView;
