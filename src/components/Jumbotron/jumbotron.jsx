import '../Jumbotron/jumbotron.css'

function Jumbotron () {
    return (
        <div>
            <div className="jumbotron">
                <h1 className="display-4">Your Gateway to Limitless Discovery!</h1>
                <p>Your next favourite artist and unforgettable live experience are just a tap away.</p>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Search a genre" aria-label="Search a genre" aria-describedby="button-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">Search</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jumbotron;