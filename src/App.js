import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Card from './components/Card'
import Marker from './components/Marker';
import Arrow from './components/Icons/Arrow';
import IconMarker from './components/Icons/IconMarker';
import FooterIcons from './components/Icons/FooterIcons';
import Spinner from './components/Icons/Spinner';
import Menu from './components/Menu';
import heroImage from './images/hero-image.jpg';

const radius = 500;
const idClient = "WEB.SERV.redlim@gmail.com";
const passKey = "FB5B0E17-88EB-407E-A222-97F0916E0C41";
const urlGetStopsFromXY = "https://openbus.emtmadrid.es:9443/emt-proxy-server/last/geo/GetStopsFromXY.php";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stopsBus: [],
      loading: false,
      currentPage: 1,
      elementsPerPage: 4,
      center: {lat:40.41, lng:-3.70},
      zoom: 15,
      hidden: true,
      selectedStop: null
    };
    this.handleClickPagination = this.handleClickPagination.bind(this);
    this.handleClickBilbao=this.handleClickBilbao.bind(this);
    this.handleClickCocktail=this.handleClickCocktail.bind(this);
    this.handleClickCampo=this.handleClickCampo.bind(this);
    this.fetchInfoBuses=this.fetchInfoBuses.bind(this);
    this.setCurrentStop=this.setCurrentStop.bind(this);
  }

  setCurrentStop(stop) {
    this.setState({
      selectedStop: stop
    });
    console.log(this.state.selectedStop);
  }

  handleClickPagination(event) {
    const numberPagination = document.querySelectorAll(".number-pagination");
    this.setState({
      currentPage: Number(event.target.id)
    });
    for(let i = 0; i < numberPagination.length; i++) {
      numberPagination[i].classList.remove('active');
      event.target.classList.add('active');
    }
  }

  fetchInfoBuses(latitude,longitude) {
    fetch(urlGetStopsFromXY, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:
      "idClient="+idClient+"&passKey="+passKey+"&latitude="+latitude+"&longitude="+longitude+"&Radius="+radius+"&statistics=&cultureInfo=",
    }).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        stopsBus: data.stop,
        loading : true,
        selectedStop: data.stop[0]
      });
    })
  }

  handleClickBilbao(event){
    let latitudeBilbao = 40.429154;
    let longitudeBilbao = -3.701952;
    this.fetchInfoBuses(latitudeBilbao,longitudeBilbao);
    this.setState({
      center:{lat:latitudeBilbao, lng:longitudeBilbao},
      zoom: 15,
      hidden: false,
    });
    return <GoogleMapReact
    center={this.state.center}
    zoom={this.state.zoom}/>
  }

  handleClickCocktail(event){
    let latitudeCocktail = 40.454146;
    let longitudeCocktail = -3.700346;
    this.fetchInfoBuses(latitudeCocktail,longitudeCocktail);
    this.setState({
      center:{lat:latitudeCocktail, lng:longitudeCocktail},
      zoom: 15,
      hidden: false
    });
    return <GoogleMapReact
    center={this.state.center}
    zoom={this.state.zoom}/>
  }

  handleClickCampo(event){
    let latitudeCampo = 40.614497;
    let longitudeCampo = -3.854413;
    this.fetchInfoBuses(latitudeCampo,longitudeCampo);
    this.setState({
      center:{lat:latitudeCampo, lng:latitudeCampo},
      zoom: 15,
      hidden: false
    });
    return <GoogleMapReact
    center={this.state.center}
    zoom={this.state.zoom}/>
  }

  render() {
    const hiddenResults = this.state.hidden ? 'hidden' : '';
    const stopsBus = this.state.stopsBus;

    // Pagination
    const { currentPage, elementsPerPage } = this.state;
    const indexOfLastAll = currentPage * elementsPerPage;
    const indexOfFirstAll = indexOfLastAll - elementsPerPage;
    const currentElements = stopsBus.slice(indexOfFirstAll, indexOfLastAll);
    const renderElementsPage = currentElements.map((stop, index) => {
          return <Card stop={stop} key={index} setCurrentStop={this.setCurrentStop} />;
        });
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(stopsBus.length / elementsPerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
          <li className={"number-pagination button-light-font " + (number === 1 ? 'active' : "")} key={number} id={number} onClick={this.handleClickPagination} >
            {number}
          </li>
      );
    });

    return (
      <div>
        <Menu />
        <section className="hero" style={{backgroundImage: `url(${heroImage})`}} id="hero">
          <h1 className="hero-title uppercase margin-title center">bus app</h1>
          <p className="hero-subtitle center padding-subtitle">El mundo, en la palma de tu mano</p>
          <Arrow className="arrow-down"/>
        </section>
        <main className= "home" id="intro">
          <div className= "intro">
            <IconMarker className="marker-icon-intro" />
            <h2 className= "home-title introduction-title center">Bienvenido a BusApp</h2>
            <p className= "home-text introduction-body center">Para comenzar, elige una zona para descubrir las paradas disponibles</p>
            <div className= "home-menu-buttons">
              <a href="#map"><button onClick={this.handleClickBilbao} className= "home-button main-button button-light-font" type="button" name="button">Glorieta de bilbao</button></a>
              <a href="#map"><button onClick={this.handleClickCocktail} className= "home-button main-button button-light-font" type="button" name="button">The cocktail</button></a>
              <a href="#map"><button onClick={this.handleClickCampo} className= "home-button main-button button-light-font" type="button" name="button">El campo</button></a>
            </div>
          </div>

          <div className="map" id="map">
            <GoogleMapReact
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            center={this.state.center}
            zoom={this.state.zoom}
            bootstrapURLKeys={{key: 'AIzaSyC7n0BhHlxsVU_li9hGJMFIFbYQcFqaggw'}}
            >
            {stopsBus.map( (stop,index) => {
              return (
                <Marker
                  lng={ stop.longitude }
                  lat={ stop.latitude }
                  key={ index }
                  selected = { stop === this.state.selectedStop }
                />
              )
            })}
            </GoogleMapReact>
        </div>

        <section className={`section-cards ${hiddenResults}`}>
         <h3 className="m-top-none section-title-font section-title">Resultados</h3>
         <div className="container-cards">
          { this.state.loading ? null : <Spinner />  }
          {renderElementsPage}
        </div>
        <ul id="page-numbers flex" className="list-pagination">
          {renderPageNumbers}
        </ul>
      </section>
        <div className="box-goUp">
          <a className="link-goUp" href="#intro">Volver arriba</a>
        </div>

        </main>

        <footer className="footer footer-font">
          <FooterIcons className="icons-footer"/>
          <p>Hecho por 'Las Apis' de Adalab</p>
        </footer>

      </div>
    );
  }

}

App.defaultProps={
  center: {lat:40.41, lng:-3.70},
  zoom: 1
};

export default App;
