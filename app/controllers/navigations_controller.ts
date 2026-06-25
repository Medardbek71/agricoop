import Member from '#models/member'
import { memberValidator } from '#validators/member'
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

}