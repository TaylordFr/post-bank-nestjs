import { Controller, Get, Render, Post, Body, Res} from '@nestjs/common';
import { AppService } from './app.service';
import { NewAccountDto } from './newAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  #accounts = [
    {
      id: '2222-3333',
      owner: 'Admin',
      balance: 15000
    },
    {
      id: '1234-3333',
      owner: 'Anonymous',
      balance: 200000,
    },
    {
      id: '4567-3333',
      owner: 'Me',
      balance: 0,
    }
  ]

  @Get('newAccount')
  @Render('newAccountForm')
  newAccountForm(){
    return{
      errors: [],
      data: {}
    }
  }

  @Post('newAccount')
  newAccount(
    @Body() accountData: NewAccountDto,
    @Res() response: Response
  ) {

    //Hibakezelés:
    const errors: string[] = [];
    if(!accountData.balance || !accountData.id || !accountData.owner){
      errors.push('Minden mezőt kötelező megadni!')
    }
    if(! /^\d{4}-\d{4}$/.test(accountData.id)){
      errors.push('A számlaszám nem megfelelő formátumú!')
    }
    const balance = parseInt(accountData.balance);
    if(isNaN(balance)){
      errors.push('A kezdő egyenleg szám kell, hogy legyen!')
    }
    if(balance < 0){
      errors.push('A kezdő egyenleg nem lehet negatív!')
    }
    if(this.#accounts.find(e => e.id == accountData.id != undefined)){
      errors.push('Ilyen azonozítójú számla már létezik!')
    }
    //

    const newAccount = {
      id: accountData.id,
      owner: accountData.owner,
      balance: parseInt(accountData.balance),
    }
    
    if(errors.length > 0){
      response.render('newAccountForm', {
        errors,
        data: accountData
      })
      return;
    }

    this.#accounts.push(newAccount)
    // 303 -> /newAccountSuccess
    response.redirect(303, '/newAccountSuccess');
    
  }

  @Get('newAccountSuccess')
  @Render('success')
  newAccountSuccess(){
    
    return{
      accounts: this.#accounts.length
    }
  }
}
