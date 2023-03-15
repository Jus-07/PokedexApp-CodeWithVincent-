import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from "next/link";
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ['latin'] })


function Paragraph(props) {
  return (
    <p>{props.id}:{props.title}</p>
  )
}

function idFromPoke(pokemon) {
  return pokemon.url.replace(
    "https://pokeapi.co/api/v2/pokemon/",
    ""
  ).replace("/", "");
}

function Card(props) {
  const [likes, setLikes] = useState(0);

  return (
    <div className="card col-4 d-flex justify-content-center text-bg-dark" >

      <img src={props.src} className="card-img-top" style={{ width: "${likes}px" }} alt="..." />
      <div className="card-body">
        <Link href={{pathname: "pokemons/[id]", query: {id: props.id}}} legacyBehavior>
        <a><h5 className="card-title">{props.title}</h5></a>
        </Link>
        <p className="card-text">{props.text}</p>
        {likes == 0 ? null : <p className="card-text">likes {likes}</p>}
        {/* Ternary operator: <condition> ? true:false, know that null means nothing */}
        {likes == 10 ? null : (<button onClick={() => { setLikes(likes + 1) }}>Like </button>)}
        {/* updates on its own, by changing the variable of the individual card by 1 */}
      </div>
    </div>
  );

}


function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    setisLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        setisLoading(false);
        setPokemonList([...pokemonList, ...json["results"]]); //code puts the pokemonList and then adds the newer results
      })
  }, [offset])

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          {pokemonList.map(pokemon => {
            const id = idFromPoke(pokemon);
            return <Card
              key= {id}
              id={id}
              title={pokemon["name"]}
              text="pokemon"
              buttonText="like"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} />
          })}

        </div>
        {isLoading == true ? <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div> : null}
        <div>
          <button onClick={() => { setOffset(offset + limit) }} >expand</button>
        </div>
      </div>

    </div>

  );
}

export default App;