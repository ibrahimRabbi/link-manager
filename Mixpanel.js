import mixpanel from 'mixpanel-browser';
const mixpanel_token = import.meta.env.VITE_MIXPANEL_TOKEN;
mixpanel.init(mixpanel_token);


let actions = {
  track: (name, props) => {
    if (name) mixpanel.track(name, props);
  },
};

export let Mixpanel = actions;