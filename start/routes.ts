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
  router.get('products',[controllers.Navigations,'productPage']).as('productPage')
  router.get('activity',[controllers.Navigations,'activityPage']).as('activityPage')
  router.get('contributions',[controllers.Navigations,'contributionPage']).as('contributionsPage')
  router.get('stocks',[controllers.Navigations,'stockPage']).as('stockPage')
  router.post('contribution-settings',[controllers.Navigations,'handleContributionsSettings']).as('handleContributionsSetting')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'contributionList']).as('index')
    router.get('add',[controllers.Navigations,'addContribution']).as('add')
    router.post('handle',[controllers.Navigations,'handleAddContribution']).as('handleAdd')
  }).prefix('contribution').as('contribution')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'productList']).as('index')
    router.get('add',[controllers.Navigations,'addProduct']).as('add')
    router.get('addSell',[controllers.Navigations,"addSell"]).as('addSell')
    router.post('handle',[controllers.Navigations,'handleAddProduct']).as('handleAdd')
    router.post('handleSell',[controllers.Navigations,'handleAddSell']).as('handleSell')
    router.get('edit/:id',[controllers.Navigations,'editProduct']).as('edit')
    router.delete('delete/:id',[controllers.Navigations,'deleteProduct']).as('delete')
    router.put('update/:id',[controllers.Navigations,'updateProduct']).as('update')
  }).prefix('product').as('product')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'memberList']).as('index')
    router.get('add',[controllers.Navigations,'addMember']).as('add')
    router.post('handle',[controllers.Navigations,'handleAddMember']).as('handleAdd')
    router.delete('delete/:id',[controllers.Navigations,'deleteMember']).as('delete')
  }).prefix('member').as('member')

  router.group(()=>{
    router.get('index',[controllers.Navigations,'allActivity']).as('all')
    router.get('sales',[controllers.Navigations,'sellActivity']).as('sales')
    router.get('stock',[controllers.Navigations,'stockActivity']).as('stock')
    router.get('member',[controllers.Navigations,'memberActivity']).as('member')
  }).prefix('activity').as('activity')
  })


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
