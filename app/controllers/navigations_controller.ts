import Activity from '#models/activity'
import Contribution from '#models/contribution'
import Member from '#models/member'
import Product from '#models/product'
import { contributionValidator } from '#validators/contribution'
import { memberValidator } from '#validators/member'
import { productValidator } from '#validators/product'
import { sellValidator } from '#validators/sell'
import { updateProductValidator } from '#validators/update_product'
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
    return view.render('pages/activity/all')
    }

    public contributionPage({view}:HttpContext){
    return view.render('pages/contributionsPage')
    }

    public async stockPage({view}:HttpContext){
        const products = await Product.all()
        const totalStockValue = products.reduce((total, product) => {
            const productValue = (product.price ?? 0) * (product.quantity ?? 0);
            return total + productValue;
        }, 0);
        const productsWithAlert = products.filter(product => {
            const alertStock = product.alertStock ?? 0;
            const quantity = product.quantity ?? 0;
            return quantity <= alertStock;
        }); 
    return view.render('pages/stockPage',{products:products, totalStockValue:totalStockValue, productsWithAlert:productsWithAlert})
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

    public async addContribution({view}:HttpContext){
        const  members = await Member.all()
        return view.render('pages/contributions/add',{members})
    }

    public async handleAddMember({ response, request, session }: HttpContext) {
        try {
            const payload = await request.validateUsing(memberValidator)
            await Member.create(payload)
            session.flash('success', 'Le membre a été inscrit avec succès au registre.')
            Activity.create({
                type: 'member',
                title: 'Nouveau membre inscrit',
                description: `Le membre ${payload.first_name} ${payload.last_name} a été inscrit avec succès.`,
                meta: { null:'null' }
            })
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
            Activity.create({
                type: 'member',
                title: 'Membre exclu',
                description: `Le membre ${member.firstName} ${member.lastName} a été exclu avec succès.`,
                meta: { memberId: member.id }
            })
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
            const price = product.price ?? 0
            if (available < requested) {
                session.flash('error', "La quantité demandée dépasse le stock disponible.")
                return response.redirect().back()
            }
            product.quantity = available - requested
            await product.save()
            Activity.create({
                type: 'sale',
                title: 'Vente enregistrée',
                description: ` ${requested} kg de ${product.name} vendus. pour un montant de ${price * requested} FCFA.`,
                meta: { productId: product.id, quantity: requested }
            })

              Activity.create({
                type: 'stock',
                title: 'Quantité de produit mise à jour',
                description: `Vous venez de retirer ${requested} kg au stock du produit ${product.name}.`,
                meta: { productId: product.id }
            })
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

    public async editProduct({ params, view }: HttpContext) {
        try {
            const product = await Product.findOrFail(params.id)
            const members = await Member.all()
            return view.render('pages/product/edit', { product, members })
        } catch (error) {
            console.error(error)
            return view.render('errors/not-found')
        }
    }

    public async deleteProduct({ params, response, session }: HttpContext) {
        try {
            const product = await Product.findOrFail(params.id)
            await product.delete()
            session.flash('success', `Le produit ${product.name} a été supprimé avec succès.`)
            Activity.create({
                type: 'product',
                title: 'Produit supprimé',
                description: `Le produit ${product.name} a été supprimé avec succès.`,
                meta: { productId: product.id }
            })
        } catch (error) {
            console.error(error)
            session.flash('error', "Une erreur est survenue lors de la tentative de suppression du produit.")
        }
        return response.redirect().toRoute('product.index')
    }

    public async updateProduct({ params, request, response, session }: HttpContext) {
        try {
            console.log(request.all())
            const payload = await request.validateUsing(updateProductValidator)
            const product = await Product.findOrFail(params.id)
            product.name = payload.name ?? product.name
            product.price = payload.price ?? product.price
            if (payload.stock_qty !== undefined && payload.stock_operation) {
                if (payload.stock_operation === 'add') {
                    product.quantity = (product.quantity ?? 0) + payload.stock_qty
                     Activity.create({
                type: 'stock',
                title: 'Produit mis à jour',
                description: `Vous venez d'ajouter ${payload.stock_qty} kg au stock du produit ${product.name}.`,
                meta: { productId: product.id }
            })
                } else if (payload.stock_operation === 'remove') {
                    const newQuantity = (product.quantity ?? 0) - payload.stock_qty
                     Activity.create({
                type: 'stock',
                title: 'Produit mis à jour',
                description: `Vous venez de retirer ${payload.stock_qty} kg du stock du produit ${product.name}.`,
                meta: { productId: product.id }
            })
                    if (newQuantity < 0) {
                        session.flash('error', "La quantité à soustraire dépasse le stock disponible.")
                        return response.redirect().back()
                    }
                    product.quantity = newQuantity
                }
            }
            await product.save()
            session.flash('success', 'Le produit a été mis à jour avec succès.')
            Activity.create({
                type: 'product',
                title: 'Produit mis à jour',
                description: `Le produit ${product.name} a été mis à jour avec succès.`,
                meta: { productId: product.id }
            })
        } catch (error) {
            console.error(error)
            session.flash('error', "Une erreur est survenue lors de la mise à jour du produit.")
        }
        return response.redirect().toRoute('product.index')
    } 
    
    public async allActivity({view}:HttpContext){
        const activities = await Activity.query().whereIn('type', ['product', 'stock', 'sale', 'member']).orderBy('createdAt', 'desc')
        return view.render('pages/activity/all',{activities})
    }

    public async sellActivity({view}:HttpContext){
        const activities = await Activity.query().where('type','sale').orderBy('createdAt', 'desc')
        return view.render('pages/activity/sales',{activities})
    }

    public async stockActivity({view}:HttpContext){
        const activities = await Activity.query()
        .whereIn('type', ['product', 'stock'])
        .orderBy('createdAt', 'desc')
        return view.render('pages/activity/stock',{activities})
    }

    public async memberActivity({view}:HttpContext){
        const activities = await Activity.query().where('type','member').orderBy('createdAt', 'desc')
        return view.render('pages/activity/member',{activities})
    }

    public async handleAddContribution({ request, response, session }: HttpContext) {
        try {
            const data = request.only(['member_id', 'amount', 'reason', 'isComplete', 'rest', 'contribution_month', 'note'])
            console.log(data)
            console.log('start validation')
            const payload = request.validateUsing(contributionValidator)
            console.log('validation passed', payload)

            await Activity.create({
                type: 'contribution',
                title: 'Nouvelle contribution enregistrée',
                description: `Une nouvelle contribution a été enregistrée pour le membre avec l'ID ${payload.member_id} pour le mois de ${payload.contribution_month}.`,
                meta: { memberId: payload.member_id, amount: payload.amount }
            })


            await Contribution.create({
                memberId: payload.member_id,
                amount: payload.amount,
                reason: payload.reason,
                isComplete: payload.isComplete,
                rest: payload.rest,
                contributionMonth: payload.contribution_month,
                note: payload.note
            })
            // session.flash('success', 'La contribution a été enregistrée avec succès.')
            // return response.redirect().toRoute('contribution.index')
        } catch (error) {
            console.error(error)
            session.flash('error', "Une erreur est survenue lors de l'enregistrement de la contribution.")
            return response.redirect().back()
        }
    }   
}