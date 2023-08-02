export const showOslcData = (nodeData) => {
  return {
    /* prettier-ignore */
    api: nodeData?.koatl_uri?.includes('gitlab-oslc-api-dev')
      ? 'gitlab'
      : nodeData?.koatl_uri?.includes('jira-oslc-api-dev')
        ? 'jira'
        : nodeData?.koatl_uri?.includes('glide-oslc-api-dev')
          ? 'glide'
          : nodeData?.koatl_uri?.includes('valispace-oslc-api-dev')
            ? 'valispace'
            : // eslint-disable-next-line max-len
            nodeData?.koatl_uri?.includes('codebeamer-oslc-api-dev')
              ? 'codebeamer'
              : 'unknown',
    /* prettier-ignore */
    branch_name: nodeData?.branch_name ? nodeData?.branch_name : '',
    commit_id: '',
    content_hash: nodeData?.content ? nodeData?.content : '',
    description: nodeData?.content_path ? nodeData?.content_path : '',
    id: nodeData?.id,
    link_type: nodeData?.link_type,
    name: nodeData?.name ? nodeData?.name : '',
    path: nodeData?.koatl_path ? nodeData?.koatl_path : '',
    provider_id: nodeData?.provider_id,
    provider_name: nodeData?.project,
    selected_lines: nodeData?.content_lines ? nodeData?.content_lines : '',
    status: nodeData?.status,
    unique_node_id: nodeData?.unique_node_id,
    web_url: nodeData?.id,
  };
};
