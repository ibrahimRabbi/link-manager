// UID generator 
function UniqueID(mask = 'xxyx4xxyxxxyxx-yxxxyx-yxxxx') {
  return `${mask}`.replace(/[xy]/g, function(c) {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default UniqueID;