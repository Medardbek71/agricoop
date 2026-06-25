import Member from '#models/member'
import Product from '#models/product'
import { memberValidator } from '#validators/member'
import { productValidator } from '#validators/product'
import { sellValidator } from '#validators/sell'
import type { HttpContext } from '@adonisjs/core/http'

export default class NavigationsController {
    public index({view}:HttpContext){
        return view.render('pages/home')
    }

    public async memberList({view}:HttpContext){
        const memberList = await Member.all()
        return view.render('pages/member/index',{members:memberList , size:memberList.length})
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

    public async stockPage({view}:HttpContext){
        const products = await Product.all()
    return view.render('pages/stockPage',{products})
    }

    public addMember({view}:HttpContext){
        return view.render('pages/member/add')
    }

    public async productList({view}:HttpContext){
        const products = await Product.all()
        return view.render('pages/product/index',{products})
    }

    public async addProduct({view}:HttpContext){
        const members = await Member.all()
        return view.render('pages/product/add',{members})
    }

    public contributionList({view}:HttpContext){
        return view.render('pages/contributions/index')
    }

    public addContribution({view}:HttpContext){
        return view.render('pages/contributions/add')
    }

    public async handleAddMember({ response, request, session }: HttpContext) {
        try {
            const payload = await request.validateUsing(memberValidator)
            await Member.create(payload)
            session.flash('success', 'Le membre a été inscrit avec succès au registre.')
            return response.redirect().toRoute('member.index')
        } catch (error) {
            session.flash('error', "Une erreur est survenue lors de l'inscription.")
            return response.redirect().back()
        }
    }


    public async deleteMember({ params, response, session }: HttpContext) {
        console.log("params.id",params.id)
        try {
            const member = await Member.findOrFail(params.id)
            await member.delete()
            session.flash('success', `Le membre ${member.firstName} ${member.lastName} a été exclu avec succès.`)
            
        } catch (error) {
            console.error(error)
            session.flash('error', "Une erreur est survenue lors de la tentative d'exclusion du membre.")
        }
        return response.redirect().toRoute('member.index')
    }

    public async addSell({view}:HttpContext){
        const products = await Product.all()
        return view.render('pages/product/addSell',{products})
    }

    public async handleAddSell({ request, response, session }: HttpContext) {   
        try {
            console.log('start validation')
            const payload = await request.validateUsing(sellValidator)
            console.log('validation passed', payload)
            const product = await Product.findByOrFail('id',payload.product_id)
            const available = product.quantity ?? 0
            const requested = payload.quantity ?? 0
            if (available < requested) {
                session.flash('error', "La quantité demandée dépasse le stock disponible.")
                return response.redirect().back()
            }
            product.quantity = available - requested
            await product.save()
            session.flash('success', 'La vente a été enregistrée avec succès.')
            return response.redirect().toRoute('product.index')
        }catch(error){
            session.flash('error', "Une erreur est survenue lors de l'enregistrement de la vente.")
            return response.redirect().back()
        }
    }

    public async handleAddProduct({ request, response, session }: HttpContext) {
        console.log(request.all())
       try{
        console.log("validation start")
            const payload = await request.validateUsing(productValidator)
            console.log("validation passed")
            await Product.create({
                ownerId: payload.owner_id,
                name: payload.name,
                quantity: payload.quantity,
                price: payload.price,
                alertStock: payload.alert_stock,
                available:true
            })
            session.flash('success', 'Le produit a été ajouté avec succès.')
            return response.redirect().toRoute('product.index')
       }catch(error){
            session.flash('error', "Une erreur est survenue lors de l'ajout du produit.")
            return response.redirect().toRoute("product.index")
       }
    }

}