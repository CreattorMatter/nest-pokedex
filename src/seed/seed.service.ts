import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response-interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    private readonly _pokemonService: PokemonService,
    private readonly _http: AxiosAdapter,
  ) { }



  async executeSeed() {

    await this._pokemonService.removeAll();

    const data = await this._http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: CreatePokemonDto[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2]
      pokemonToInsert.push({ name, no });

    })

    await this._pokemonService.createMany(pokemonToInsert);

    return 'Seed executed';
  }
}
