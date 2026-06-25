import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'productPage': { paramsTuple?: []; params?: {} }
    'activityPage': { paramsTuple?: []; params?: {} }
    'contributionsPage': { paramsTuple?: []; params?: {} }
    'stockPage': { paramsTuple?: []; params?: {} }
    'contribution.index': { paramsTuple?: []; params?: {} }
    'contribution.add': { paramsTuple?: []; params?: {} }
    'product.index': { paramsTuple?: []; params?: {} }
    'product.add': { paramsTuple?: []; params?: {} }
    'member.index': { paramsTuple?: []; params?: {} }
    'member.add': { paramsTuple?: []; params?: {} }
    'member.handleAdd': { paramsTuple?: []; params?: {} }
    'member.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'productPage': { paramsTuple?: []; params?: {} }
    'activityPage': { paramsTuple?: []; params?: {} }
    'contributionsPage': { paramsTuple?: []; params?: {} }
    'stockPage': { paramsTuple?: []; params?: {} }
    'contribution.index': { paramsTuple?: []; params?: {} }
    'contribution.add': { paramsTuple?: []; params?: {} }
    'product.index': { paramsTuple?: []; params?: {} }
    'product.add': { paramsTuple?: []; params?: {} }
    'member.index': { paramsTuple?: []; params?: {} }
    'member.add': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'productPage': { paramsTuple?: []; params?: {} }
    'activityPage': { paramsTuple?: []; params?: {} }
    'contributionsPage': { paramsTuple?: []; params?: {} }
    'stockPage': { paramsTuple?: []; params?: {} }
    'contribution.index': { paramsTuple?: []; params?: {} }
    'contribution.add': { paramsTuple?: []; params?: {} }
    'product.index': { paramsTuple?: []; params?: {} }
    'product.add': { paramsTuple?: []; params?: {} }
    'member.index': { paramsTuple?: []; params?: {} }
    'member.add': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'member.handleAdd': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'member.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}