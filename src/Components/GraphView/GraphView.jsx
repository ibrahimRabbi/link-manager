import React, { useContext, useEffect } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphData } from '../../Redux/slices/graphSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import rootData from './rootData';

const graphApiURL= `${process.env.REACT_APP_REST_API_URL}/visualize`;

const GraphView = () => {
  const {graphData, isLoading}=useSelector(state=>state.graph);
  const authCtx = useContext(AuthContext);
  const dispatch =useDispatch();

  useEffect(()=>{
    dispatch(handleCurrPageTitle('Graph view'));
    dispatch(fetchGraphData({url:graphApiURL, token:authCtx.token}));
  },[]);
  console.log('Loading: ', isLoading, graphData,);

  return (
    <div style={{width:'100%', height:'90vh'}}>
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
