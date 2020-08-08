import UniversalRouter from 'universal-router';
import routes from './routes';

export default new UniversalRouter(routes, {
  async resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      const action = await context.route.load();
      return action.default(context, params);
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return undefined;
  },
});
