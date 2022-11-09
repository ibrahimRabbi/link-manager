const useSessionStorage=( action, key, value)=>{
  if(action === 'set') return sessionStorage.setItem(key, value);
  else if(action === 'get') return sessionStorage.getItem(key);
  else if(action === 'remove') return sessionStorage.removeItem(key);
};

export default useSessionStorage;