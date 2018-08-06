import Router from './-utils/router';

Router.map(function() {
  this.route('home', { path: '/home', component: 'Home' });
  this.route('router', { path: '/router', component: 'Router' });
});

export default Router;
