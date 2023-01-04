import React, { useEffect } from 'react'
import Header from "./Header.jsx";
import IconList from "./IconList.jsx";

const App = () => {
    console.log('start')
    return (
        <>
            <Header></Header>
            <div>success react renddering - sample1/child11</div>
            <IconList />
        </>
    )
}

export default App