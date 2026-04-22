import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async executeSeed() {

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

    data.results.forEach(async ({ name, url }) => {

      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      const pokemon = await this.pokemonModel.create({ name, no }) // resolution FH
    })

    // pokemons.forEach(async pokemon => await this.pokemonService.create(pokemon)) // Mi opcion
    return 'Seed executed';

  }
}
