import Activity from '#models/activity'
import Contribution from '#models/contribution'
import ContributionInfo from '#models/contribution_info'
import Member from '#models/member'
import Product from '#models/product'
import { contributionValidator } from '#validators/contribution'
import { memberValidator } from '#validators/member'
import { productValidator } from '#validators/product'
import { sellValidator } from '#validators/sell'
import { updateProductValidator } from '#validators/update_product'
import { contributionInfoValidator } from '#validators/contribution_settings_info'
import type { HttpContext } from '@adonisjs/core/http'

interface FormattedMember {
    name: string
    lastAmount: string
    lastPeriod: string
    statusLabel: string
    statusStyle: string
    months: Record<string, 'empty' | 'paid' | 'late'>
}

export default class NavigationsController {
    public async index({view}:HttpContext){
        const activities = await Activity.all()
        return view.render('pages/home',{activities:activities})
    }

    public async memberList({view}:HttpContext){
        const memberList = await Member.all()
        return view.render('pages/member/index',{members:memberList , size:memberList.length})
    }

    public productPage({view}:HttpContext){
    return view.render('pages/productPage')
    }
    

    public async activityPage({view}:HttpContext){
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

    // public contributionList({view}:HttpContext){
    //     return view.render('pages/contributions/index')
    // }

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
        const validatedData = await request.validateUsing(contributionValidator)
        const { amount, notes, contribution_month, member_id } = validatedData

        const rules = await ContributionInfo.firstOrFail()
        const monthlyContributionAmount = rules.monthlyContributionAmount || 0

        const existingContribution = await Contribution.query()
            .where('memberId', member_id)
            .where('contributionMonth', contribution_month)
            .first() 

        if (existingContribution) {
            if (existingContribution.isComplete) {
                session.flash('error', "Ce membre a déjà entièrement payé sa contribution pour ce mois.")
                return response.redirect().back()
            }

            const previousAmount = existingContribution.amount ?? 0
            const newTotalAmount = previousAmount + amount
            const newRest = newTotalAmount - monthlyContributionAmount

            existingContribution.amount = newTotalAmount
            existingContribution.rest = newRest
            existingContribution.isComplete = newRest >= 0
            
            await existingContribution.save()

            await Activity.create({
                type: 'contribution',
                title: 'Contribution complétée',
                description: `Le paiement du membre ID ${member_id} pour le mois de ${contribution_month} a été complété de ${amount}.`,
                meta: { memberId: member_id, amount }
            })

            session.flash('success', 'Le complément de contribution a été enregistré avec succès.')
            return response.redirect().toRoute('contribution.index')
        }

        const rest = amount - monthlyContributionAmount

        await Activity.create({
            type: 'contribution',
            title: 'Nouvelle contribution enregistrée',
            description: `Une nouvelle contribution a été enregistrée pour le membre avec l'ID ${member_id} pour le mois de ${contribution_month}.`,
            meta: { memberId: member_id, amount }
        })

        await Contribution.create({
            amount,
            contributionMonth: contribution_month,
            reason: 'reason',
            note: notes,
            memberId: member_id,
            rest,
            isComplete: rest >= 0 
        })

        session.flash('success', 'La contribution a été enregistrée avec succès.')
        return response.redirect().toRoute('contribution.index')

    } catch (error) {
        console.error(error)
        session.flash('error', "Une erreur est survenue lors de l'enregistrement de la contribution.")
        return response.redirect().back()
    }
}


public async contributionList({ view }: HttpContext) {
        try {
            // Récupérer tous les membres avec leurs contributions
            const databaseMembers: Member[] = await Member.query().preload('contribution')
            
            // Clés des mois avec typage strict
            const monthsKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const
            
            const monthsLabelsFull: Record<string, string> = {
                jan: 'Janvier', feb: 'Février', mar: 'Mars', apr: 'Avril', may: 'Mai', jun: 'Juin',
                jul: 'Juillet', aug: 'Août', sep: 'Septembre', oct: 'Octobre', nov: 'Novembre', dec: 'Décembre'
            }

            // const totalMonthlyRevenue = await Contribution.query().
            const result1 = await Contribution.query().sum('amount as total')
            const totalRevenue = result1[0].$extras.total || 0

            const currentMonth = 'june' 

            const result = await Contribution.query()
                .where('contributionMonth', currentMonth)
                .sum('amount as total')

            const totalMonthlyRevenue = Number(result[0].$extras.total || 0)

            // 2. Formater les données avec le type de retour explicite
            const members: FormattedMember[] = databaseMembers.map((member) => {
                // Initialiser le dictionnaire des mois avec le type adéquat
                const monthsStatus: Record<string, 'empty' | 'paid' | 'late'> = {}
                let lastContribution: any = null // Mets le type de ton modèle ici (ex: Contribution)

                // Initialiser tous les mois à 'empty'
                monthsKeys.forEach((m) => {
                    monthsStatus[m] = 'empty'
                })

                // Remplir le statut des mois en fonction des contributions réelles
                // Note: Ajuste 'contributionInfos' ou 'contributions' selon ta relation Lucid
                const userContributions = (member as any).contributionInfos || member.contribution || []

                userContributions.forEach((contrib: any) => {
                    if (contrib.contributionMonth) {
                        const monthKey = contrib.contributionMonth.toLowerCase().substring(0, 3)
                        
                        // Validation stricte que la clé existe bien parmi nos 12 mois
                        if (monthsKeys.includes(monthKey as any)) {
                            monthsStatus[monthKey] = contrib.isComplete ? 'paid' : 'late'
                        }
                        
                        // Garder la contribution la plus récente
                        if (!lastContribution || contrib.updatedAt > lastContribution.updatedAt) {
                            lastContribution = contrib
                        }
                    }
                })

                // Déterminer le statut global pour le badge
                let statusLabel = 'En attente'
                let statusStyle = 'background-color: #fff9eb; color: #f59e0b;'

                if (lastContribution) {
                    if (lastContribution.isComplete) {
                        statusLabel = 'Réglé'
                        statusStyle = 'background-color: #ecfdf5; color: #10b981;'
                    } else {
                        statusLabel = 'En retard'
                        statusStyle = 'background-color: #fde8e8; color: #df1c1c;'
                    }
                }

                // Formater la période du dernier montant affiché
                let lastPeriod = 'Aucune'
                if (lastContribution && lastContribution.contributionMonth) {
                    const labelKey = lastContribution.contributionMonth.toLowerCase().substring(0, 3)
                    lastPeriod = `${monthsLabelsFull[labelKey] || lastContribution.contributionMonth} 2026`
                }

                return {
                    name: `${member.firstName || ''} ${member.lastName || member.lastName || ''}`.trim(),
                    lastAmount: lastContribution ? Number(lastContribution.amount).toLocaleString() : '0',
                    lastPeriod: lastPeriod,
                    statusLabel: statusLabel,
                    statusStyle: statusStyle,
                    months: monthsStatus
                }
            })

            // 3. Rendu de la vue avec le contrat d'interface respecté
            return view.render('pages/contributions/index', { members,totalMonthlyRevenue,totalRevenue })

        } catch (error) {
            console.error(error)
            // return view.render('errors/not-found') 
        }
    }



    public async handleContributionsSettings({ request, response, session }: HttpContext) {
    try {
        const payload = await request.validateUsing(contributionInfoValidator)
        await ContributionInfo.updateOrCreate(
            { id: 1 },
            {
                monthlyContributionAmount: payload.monthly_contribution_amount,
                adhesionFeeAmount: payload.adhesion_fee_amount,
                paymentLimitDay: payload.payment_limit_day
            }
        )

        session.flash('success', "Les paramètres de contribution ont été mis à jour.")
        return response.redirect().back()

    } catch (error) {
        console.error(error)
            session.flash('error', "Une erreur est survenue lors de l'enregistrement des configurations.")
        }
        return response.redirect().back()
    }
}