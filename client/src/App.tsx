import React, {useEffect, useState} from 'react';
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

function App() {
    const [decks, setDecks] = useState<{ loading: boolean, error: string | false, data: { title: string }[] }>({
        loading: false,
        data: [],
        error: false
    })


    useEffect(() => {
        const url = new URL(`${process.env.REACT_APP_MERCURE_HUB_ENDPOINT}`)
        url.searchParams.append('topic', '/alert')
// The URL class is a convenient way to generate URLs such as https://localhost/.well-known/mercure?topic=https://example.com/books/{id}&topic=https://example.com/users/dunglas

        const eventSource = new EventSource(url);

// The callback will be called every time an update is published
        eventSource.onmessage = e => console.log(e) // do something with the payload

        setDecks(prev => ({...prev, loading: true, error: false}))
        axios.get<{ title: string }[]>(`${process.env.REACT_APP_API_ENDPOINT}/decks`).then(r => {
            setDecks(prev => ({...prev, data: r.data, loading: false}))
        }).catch(e => {
            console.error(e)
            setDecks(prev => ({...prev, loading: false, error: "An error occurred while fetching decks."}))
        })
    }, [])

    function publish(){
        axios.post(`${process.env.REACT_APP_MERCURE_HUB_ENDPOINT}`, {
            topic: '/alert'
        }, {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InB1Ymxpc2giOlsiKiJdfX0.DJIjrHyg_OvhBJzHjtP8g1Yrx2pejx6kORTAaTgUKYw',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    return <>
        <ToastContainer />

        <button className={"btn btn-success"} onClick={() => publish()}>pubdsflish</button>

        {decks.loading && "Loading decks"}
        {decks.error && decks.error}

        {!decks.loading && !decks.error && <>
            {decks.data.length > 0 ?
                <>
                    <h3>Decks</h3>
                    <ul>
                        {decks.data.map((item, index) => (
                            <li key={index}>{item.title}</li>
                        ))}
                    </ul>

                </> :
                "No deck created yet ..."}
        </>}

    </>
}

export default App;
