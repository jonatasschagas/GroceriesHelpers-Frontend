import React from 'react';
import AddressAutocomplete from '../../Common/AddressAutocomplete';

class Register extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    address: '',
    lat: null,
    lng: null,
    phoneNumber: '',
    email: '',
    password: '',
    password2: ''
  }

  handleChangeAutocomplete = (lat, lng, address) => {
      this.setState({
          lat,
          lng,
          address
      })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (e) => {
    if (this.state.lat && this.state.lng) {
      let newUser = {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        lat: this.state.lat,
        lng: this.state.lng,
        phoneNumber: this.state.phoneNumber,
      }
      this.props.register(newUser);
    }
  }

  render() {
    return(
      <div className="register">
        <form id="signup-form">
        <label>First name*
            <input
                className="validate"
              type="text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              required>
            </input>
          </label>

          <label>Last name
            <input
              type="text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              >
            </input>
          </label>
          <label>Address*
            <AddressAutocomplete 
                handleChangeAutocomplete={this.handleChangeAutocomplete}
                required
                />
          </label>
      
          <label>Phone number
            <input
              type="text"
              name="phoneNumber"
              value={this.state.phoneNumber}
              onChange={this.handleChange}
              >
            </input>
          </label>

          <label>Email*
            <input
            className="validate"
            id="email"
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              required>
            </input>
          </label>
          <br />

          <label>Password (min 8 characters)*
            <input
              type="password"
              name="password"
              className="validate"
              value={this.state.password}
              onChange={this.handleChange}
              minlength="8"
              required>
            </input>
          </label>

          <br />
          <label>Re-enter Password*
            <input
              type="password"
              name="password2"
              className="validate"
              value={this.state.password2}
              onChange={this.handleChange}
              minlength="8"
              required>
            </input>
          </label>

          <br />
          <p>
        <label className="required">*required</label>
        </p>
        <br />
          <a onClick={this.handleSubmit} className="btn-flat loginBtn" type="submit">Submit</a>
        </form>
      </div>
    )
  }
}

export default Register;