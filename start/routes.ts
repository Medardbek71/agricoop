/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'


router.group(()=>{
  router.get('/',[controllers.Navigations,'index']).as('home')
  router.get('members',[controllers.Navigations,'memberPage']).as('memberPage')
  router.get('products',[controllers.Navigations,'productPage']).as('productPage')
  router.get('activity',[controllers.Navigations,'activityPage']).as('activityPage')
  router.get('contributions',[controllers.Navigations,'contributionPage']).as('contributionsPage')
  router.get('stocks',[controllers.Navigations,'stockPage']).as('stockPage')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'contributionList']).as('index')
    router.get('add',[controllers.Navigations,'addContribution']).as('add')
  }).prefix('contribution').as('contribution')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'productList']).as('index')
    router.get('add',[controllers.Navigations,'addProduct']).as('add')
  }).prefix('product').as('product')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'index']).as('index')
    router.get('add',[controllers.Navigations,'addMember']).as('add')
  }).prefix('member').as('member')

}).use(middleware.auth())

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
