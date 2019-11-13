import React from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
import disasters from './disasters'
import places from './places'
import landsideIcon from './images/landslide.jpg'

const center = { lat: 35.3423, lng: 139.6197 }
const range = 0.1

class App extends React.Component {
  static defaultProps = {
    center: center,
    zoom: 12,
  }

  state = {
    places: [],
    disasters: [],
    activeMarker: {},
    selectedPlace: {},
    showingInfoWindow: false,
  }

  onMarkerClick = (props, marker) => {
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true,
    })
  }

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    })

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false,
      })
  }

  componentDidMount () {
    const yokohamaPlaces = places.filter(v => {
      const lat = Number(v[2])
      const lng = Number(v[3])
      return Number(v[4]) > 0 && (center.lat - range) <= lat && lat <= (center.lat + range) && (center.lng - range) <= lng && lng <= (center.lng + range)
    })
    console.log(yokohamaPlaces)

    const yokohamaDisasters = []
    disasters.features.forEach(v => {
      const lat = v.geometry.coordinates[1]
      const lng = v.geometry.coordinates[0]
      if ((center.lat - range) <= lat && lat <= (center.lat + range) && (center.lng - range) <= lng && lng <= (center.lng + range)) {
        yokohamaDisasters.push({
          lat, lng,
          name: v.properties.name + (v.properties['発生日時'] ? ', ' + v.properties['発生日時'] : '') + (v.properties['発生場所[地先]'] ? ', ' + v.properties['発生場所[地先]'] : '') +
            (v.properties['被害状況'] ? ', ' + v.properties['被害状況'] : ''),
          icon: v.properties._iconUrl,
        })
      }
    })
    console.log(yokohamaDisasters)
    this.setState({
      places: yokohamaPlaces,
      disasters: yokohamaDisasters,
    })
  }

  render () {
    if (!this.props.loaded) return <div>Loading...</div>

    return (
      <Map
        className="map"
        google={this.props.google}
        onClick={this.onMapClicked}
        style={{ height: '100%', position: 'relative', width: '100%' }}
        initialCenter={this.props.center}
        zoom={this.props.zoom}

      >
        {this.state.places.map((v, i) => {
          return <Marker
            key={i}
            name={v[1] + '→' + v[7]}
            onClick={this.onMarkerClick}
            position={{ lat: Number(v[2]), lng: Number(v[3]) }}
          />
        })}
        {this.state.disasters.map((v, i) => {
          return <Marker
            key={i}
            name={v.name}
            onClick={this.onMarkerClick}
            position={{ lat: v.lat, lng: v.lng }}
            icon={landsideIcon}
          />
        })}
        <InfoWindow
          marker={this.state.activeMarker}
          onClose={this.onInfoWindowClose}
          visible={this.state.showingInfoWindow}>
          <div>
            <h1>{this.state.selectedPlace.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAPS_API_KEY),
})(App)

