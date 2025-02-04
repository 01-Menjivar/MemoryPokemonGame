import { useEffect, useState } from "react";
import Scoreboard from "../Scoreboard/Scoreboard";
import Swal from 'sweetalert2'
import './Card.css'

export default function Card() {
    const [pokeData, setPokeData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPokemons, setSelectedPokemons] = useState([])
    const [score, setScore] = useState(0)
    const [highscore, setHighscore] = useState(0)

    useEffect(() => {
        const pokemons = ["bulbasaur", "charmander", "squirtle", "pikachu", "eevee", "jigglypuff", "metapod", "rattata", "raticate", "fearow", "charizard"]
        async function getPokemons(pokemonList) {
            try {
                const promises = pokemonList.map(async (pokemon) => {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, { mode: "cors" });
                    if (!res.ok) {
                        throw new Error(`Error ${res.status}: No se pudo obtener el pokemon ${pokemon}`);
                    }
                    const data = await res.json();
                    return { name: pokemon, sprite: data.sprites.front_default };
                });
                
                const results = await Promise.all(promises);
                setPokeData(results);
            } catch (err) {
                setError(err.message);
            }
        }

        getPokemons(pokemons);
    }, []);


    function handleCardClick(pokemonName) {
        if (selectedPokemons.includes(pokemonName)) {
            Swal.fire({
                title: '¡Perdiste!',
                text: `Ya seleccionaste a ${pokemonName}.`,
                confirmButtonText: 'Intentar de nuevo',
                background: '#ffcc00',
                color: '#2a75bb',
                confirmButtonColor: '#ff3d00',
                imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
                imageWidth: 80,
                imageHeight: 80,
                customClass: {
                    confirmButton: 'pokemon-button' 
                }
            });            
    
            setSelectedPokemons([]);
            score > highscore && setHighscore(score);
            setScore(0);
        } else {
            setSelectedPokemons([...selectedPokemons, pokemonName]);
            setScore(prev => prev + 1);
        }
    
        setPokeData(prevData => [...prevData].sort(() => Math.random() - 0.5));
    }

    if (error) return <p>Error: {error}</p>;
    if (pokeData.length === 0) return <p>Cargando...</p>;

    return (
        <>
        <div className="information">
        <h2 className="title">Juego de Memoria Pokémon</h2>
        <p className="instructions">Selecciona cada Pokémon solo una vez.</p>
        </div>


        <div className="pokemon-container">
            {pokeData.map((pokemon) => (
                <div 
                    key={pokemon.name} 
                    onClick={() => handleCardClick(pokemon.name)}
                    className="pokemon-card"
                >
                    <img className="pokemon-image" src={pokemon.sprite} alt={pokemon.name} />
                    <p className="pokemon-name">{pokemon.name}</p>
                </div>
            ))}
        </div>

            <div className="scoreboard">
                <Scoreboard score={score} highscore={highscore}/>
            </div>

    </>
    );
}
