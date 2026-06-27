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
    'contribution.handleAdd': { paramsTuple?: []; params?: {} }
    'product.index': { paramsTuple?: []; params?: {} }
    'product.add': { paramsTuple?: []; params?: {} }
    'product.addSell': { paramsTuple?: []; params?: {} }
    'product.handleAdd': { paramsTuple?: []; params?: {} }
    'product.handleSell': { paramsTuple?: []; params?: {} }
    'product.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.index': { paramsTuple?: []; params?: {} }
    'member.add': { paramsTuple?: []; params?: {} }
    'member.handleAdd': { paramsTuple?: []; params?: {} }
    'member.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'activity.all': { paramsTuple?: []; params?: {} }
    'activity.sales': { paramsTuple?: []; params?: {} }
    'activity.stock': { paramsTuple?: []; params?: {} }
    'activity.member': { paramsTuple?: []; params?: {} }
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
    'product.addSell': { paramsTuple?: []; params?: {} }
    'product.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.index': { paramsTuple?: []; params?: {} }
    'member.add': { paramsTuple?: []; params?: {} }
    'activity.all': { paramsTuple?: []; params?: {} }
    'activity.sales': { paramsTuple?: []; params?: {} }
    'activity.stock': { paramsTuple?: []; params?: {} }
    'activity.member': { paramsTuple?: []; params?: {} }
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
    'product.addSell': { paramsTuple?: []; params?: {} }
    'product.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.index': { paramsTuple?: []; params?: {} }
    'member.add': { paramsTuple?: []; params?: {} }
    'activity.all': { paramsTuple?: []; params?: {} }
    'activity.sales': { paramsTuple?: []; params?: {} }
    'activity.stock': { paramsTuple?: []; params?: {} }
    'activity.member': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'contribution.handleAdd': { paramsTuple?: []; params?: {} }
    'product.handleAdd': { paramsTuple?: []; params?: {} }
    'product.handleSell': { paramsTuple?: []; params?: {} }
    'member.handleAdd': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'product.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'product.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}