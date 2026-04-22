import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from Pokemon

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    })

    await this.pokemonModel.insertMany(pokemonToInsert);
    // await Promise.all(insertPromiseArray);
    // pokemons.forEach(async pokemon => await this.pokemonService.create(pokemon)) // Mi opcion
    return 'Seed executed';

  }
}
