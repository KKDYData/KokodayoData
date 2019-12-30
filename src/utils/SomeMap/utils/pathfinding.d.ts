import { Route } from '../data/mapdata';
import { PFResArr } from '.';
import SomeMap from '..';
declare const addRoutes: (route: Route, someMap: SomeMap) => PFResArr[];
export { addRoutes };
