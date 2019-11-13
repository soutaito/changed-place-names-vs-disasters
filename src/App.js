import React from 'react'
import './App.css'


class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  componentDidMount () {
    const geocodingBaseURL = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + process.env.REACT_APP_GOOGLE_MAPS_API_KEY + '&latlng='
  }

  render () {
    return (
      <table>
        <tbody>
        {this.state.data.map((v, i) => {
          return <tr key={i}>
            {
              v.map(w => <td>{w}</td>)
            }
          </tr>
        })}
        </tbody>
      </table>
    )
  }
}

export default App
