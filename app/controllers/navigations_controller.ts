import type { HttpContext } from '@adonisjs/core/http'

export default class NavigationsController {
    public index({view}:HttpContext){
        return view.render('pages/home')
    }

    public memberPage({view}:HttpContext){
    return view.render('pages/member/index')
    }

    public productPage({view}:HttpContext){
    return view.render('pages/productPage')
    }

    public activityPage({view}:HttpContext){
    return view.render('pages/activity/index')
    }

    public contributionPage({view}:HttpContext){
    return view.render('pages/contributionsPage')
    }

    public stockPage({view}:HttpContext){
    return view.render('pages/stockPage')
    }

    public addMember({view}:HttpContext){
        return view.render('pages/member/add')
    }

    public productList({view}:HttpContext){
        return view.render('pages/product/index')
    }

    public addProduct({view}:HttpContext){
        return view.render('pages/product/add')
    }

    public contributionList({view}:HttpContext){
        return view.render('pages/contributions/index')
    }

    public addContribution({view}:HttpContext){
        return view.render('pages/contributions/add')
    }
}